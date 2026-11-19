// Avisos del temporizador: pitidos, voz, vibracion y pantalla encendida.
//
// iPhone, lo que hay que saber:
// - El interruptor lateral de silencio calla la Web Audio pelada, porque iOS la
//   manda por la via del timbre. Si a la vez suena un <audio> de verdad (aqui,
//   un WAV mudo en bucle), iOS cambia a la via de la musica y los pitidos se
//   oyen. Tiene que arrancar desde el toque del usuario: por eso se llama a
//   avisos.activar() dentro del clic de "Empezar".
// - El AudioContext puede quedarse en "interrupted" (no solo "suspended") al
//   bloquear el movil o con una llamada: se comprueba contra "running".
// - La web no puede vibrar en iPhone; en Android si.
// - Wake Lock mantiene la pantalla encendida mientras corre el temporizador.
//   Se pierde al cambiar de app, asi que se vuelve a pedir al regresar.

const avisos = (function () {
  let ctx = null;
  let mudo = null;
  let candado = null;
  let quiereCandado = false;
  // vozId: voiceURI elegida a mano ("" = la mejor que haya).
  // velocidad: rate de la voz; en iPhone 1 ya suena deprisa.
  const prefs = { sonido: true, voz: true, vozId: "", velocidad: 0.85 };

  function wavMudo() {
    const n = 4000; // medio segundo a 8 kHz, 8 bits
    const b = new ArrayBuffer(44 + n);
    const d = new DataView(b);
    const txt = function (o, s) { for (let i = 0; i < s.length; i++) d.setUint8(o + i, s.charCodeAt(i)); };
    txt(0, "RIFF"); d.setUint32(4, 36 + n, true); txt(8, "WAVE"); txt(12, "fmt ");
    d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true);
    d.setUint32(24, 8000, true); d.setUint32(28, 8000, true); d.setUint16(32, 1, true); d.setUint16(34, 8, true);
    txt(36, "data"); d.setUint32(40, n, true);
    for (let i = 0; i < n; i++) d.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: "audio/wav" }));
  }

  function contexto() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state !== "running") ctx.resume();
    } catch (e) { return null; }
    return ctx;
  }

  // Llamar desde un toque del usuario.
  function activar() {
    contexto();
    try {
      if (!mudo) {
        mudo = document.createElement("audio");
        mudo.setAttribute("playsinline", "");
        mudo.loop = true;
        mudo.src = wavMudo();
      }
      const pr = mudo.play();
      if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
    try {
      // En iOS la voz tambien hay que estrenarla dentro del toque.
      if (prefs.voz && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        speechSynthesis.speak(u);
      }
    } catch (e) {}
    pantallaEncendida(true);
  }

  function desactivar() {
    try { if (mudo) mudo.pause(); } catch (e) {}
    clearTimeout(pendiente);
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    pantallaEncendida(false);
  }

  function tono(freq, dur, cuando, vol) {
    const c = contexto();
    if (!c || !prefs.sonido) return;
    const t = c.currentTime + (cuando || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function vibrar(patron) {
    try { if (navigator.vibrate) navigator.vibrate(patron); } catch (e) {}
  }

  // ---------- Voz ----------
  //
  // iOS ofrece en espanol, ademas de Monica o Jorge, voces de efecto (Eddy, Flo,
  // Abuela, Rocko...) que suenan roboticas y a menudo salen las primeras de la
  // lista. Por eso no se coge la primera: se descartan las de efecto y se
  // puntua el resto, prefiriendo las "mejoradas" si el usuario las ha
  // descargado. Tambien se puede elegir una a mano en los ajustes.
  const DE_EFECTO = /\b(eddy|flo|grandma|grandpa|abuel[ao]|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph)\b/i;
  const MEJORADA = /premium|enhanced|mejorad|neural|natural|online/i;
  const CONOCIDAS = /m[oó]nica|jorge|marisol|paulina|juan|diego|helena|laura|pablo|elvira|[aá]lvaro|google/i;

  function puntos(v) {
    return (v.lang === "es-ES" || v.lang === "es_ES" ? 4 : 0) +
           (MEJORADA.test(v.name) ? 8 : 0) +
           (CONOCIDAS.test(v.name) ? 2 : 0);
  }

  // Las voces en espanol utiles, de mejor a peor.
  function vocesEs() {
    if (!window.speechSynthesis) return [];
    return speechSynthesis.getVoices()
      .filter(function (v) { return /^es/i.test(v.lang) && !DE_EFECTO.test(v.name); })
      .sort(function (a, b) { return puntos(b) - puntos(a); });
  }

  function vozElegida() {
    const voces = vocesEs();
    return voces.filter(function (v) { return v.voiceURI === prefs.vozId; })[0] || voces[0] || null;
  }

  // Lo que se lee no es lo que se ve: el " · " de la pantalla se convierte en
  // pausa de frase, y lo que va entre parentesis (el nombre en ingles) no se lee.
  function paraLeer(texto) {
    return texto.replace(/\s*\([^)]*\)/g, "").replace(/\s*·\s*/g, ". ").trim();
  }

  let pendiente = null;
  function hablar(texto) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(paraLeer(texto));
      u.lang = "es-ES";
      const v = vozElegida();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = prefs.velocidad;
      u.pitch = 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // Con pitido, la voz entra justo despues para no pisarse con el.
  function decir(texto) {
    if (!prefs.voz || !texto || !window.speechSynthesis) return;
    clearTimeout(pendiente);
    if (prefs.sonido) pendiente = setTimeout(function () { hablar(texto); }, 450);
    else hablar(texto);
  }

  // Desde un toque (boton "Probar"): sin espera, para que iOS la deje sonar.
  function probar() {
    if (!window.speechSynthesis) return;
    clearTimeout(pendiente);
    hablar("Serie 2 de 3 · lado izquierdo · Vamos");
  }

  async function pantallaEncendida(si) {
    quiereCandado = si;
    try {
      if (si && !candado && navigator.wakeLock) {
        candado = await navigator.wakeLock.request("screen");
        candado.addEventListener("release", function () { candado = null; });
      } else if (!si && candado) {
        await candado.release();
        candado = null;
      }
    } catch (e) { candado = null; }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible" || !quiereCandado) return;
    contexto();
    pantallaEncendida(true);
  });

  // Un aviso distinto por fase, para saber que toca sin mirar.
  const porFase = {
    trabajo:  function () { tono(880, 0.15); tono(1175, 0.25, 0.18); vibrar([200, 80, 200]); },
    aguanta:  function () { tono(988, 0.15, 0, 0.35); vibrar(120); },
    suelta:   function () { tono(659, 0.15, 0, 0.35); vibrar(60); },
    descanso: function () { tono(523, 0.35); vibrar(500); },
    cambio:   function () { tono(784, 0.12); tono(784, 0.12, 0.2); vibrar([100, 80, 100]); },
    prepara:  function () { tono(660, 0.2, 0, 0.35); }
  };

  return {
    prefs: prefs,
    activar: activar,
    desactivar: desactivar,
    decir: decir,
    probar: probar,
    vocesEs: vocesEs,
    vozElegida: vozElegida,
    paraLeer: paraLeer,
    fase: function (f) { (porFase[f] || function () {})(); },
    cuenta: function () { tono(1320, 0.07, 0, 0.3); },
    fin: function () { tono(523, 0.18); tono(659, 0.18, 0.18); tono(784, 0.18, 0.36); tono(1047, 0.45, 0.54); vibrar([300, 100, 300, 100, 600]); }
  };
})();
