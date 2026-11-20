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
  // vozId: "" = la grabada; "auto" = la mejor del movil; si no, su voiceURI.
  // velocidad: rate de la voz del movil; en iPhone 1 ya suena deprisa.
  // contar: decir en voz alta el numero de cada repeticion.
  const prefs = { sonido: true, voz: true, vozId: "", velocidad: 0.95, contar: true };

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

  function sonarMudo() {
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
  }

  // Llamar desde un toque del usuario.
  function activar() {
    contexto();
    sonarMudo();
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
    callarGrabada();
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

  // ---------- Voz grabada ----------
  //
  // Safari en iPhone no deja usar las voces buenas que se descargan en Ajustes,
  // asi que las frases van grabadas con una voz natural (Alvaro) en
  // audio/voz/, una por frase, y data/voces.js dice que fichero es cada una
  // (lo genera pruebas/voces.py). Suenan por Web Audio, igual que los pitidos:
  // asi tambien se oyen con el interruptor de silencio puesto.
  //
  // Los ficheros se piden al abrir la ficha y se decodifican al pulsar
  // Empezar (hace falta el AudioContext). Si una frase no esta grabada o no se
  // puede cargar (por ejemplo, abriendo con doble clic), la dice la voz del movil.
  const RUTA_VOZ = "audio/voz/";
  const clips = {};
  let fuentes = [];
  let libreEn = 0;     // momento (reloj del AudioContext) en que acaba lo que suena
  let turno = 0;       // cada frase nueva invalida a las que estaban cargando

  function usaGrabada() {
    return prefs.vozId === "" && typeof VOCES !== "undefined";
  }

  function traer(k) {
    if (clips[k]) return clips[k];
    const id = typeof VOCES !== "undefined" && VOCES[k];
    if (!id || !window.fetch) return null;
    const c = clips[k] = { buf: null, fallo: false, decod: null };
    c.datos = fetch(RUTA_VOZ + id + ".mp3")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
    c.datos.catch(function () { c.fallo = true; });
    return c;
  }

  function decodificar(c) {
    if (c.buf) return Promise.resolve(c.buf);
    if (!c.decod) {
      c.decod = c.datos.then(function (ab) {
        return new Promise(function (ok, ko) {
          const x = contexto();
          if (!x) { ko(new Error("sin audio")); return; }
          // Forma con callbacks: la de promesa no esta en Safari antiguos.
          x.decodeAudioData(ab.slice(0), function (b) { c.buf = b; ok(b); }, ko);
        });
      });
      c.decod.catch(function () { c.decod = null; });
    }
    return c.decod;
  }

  function precargar(textos) {
    if (!usaGrabada()) return;
    (textos || []).forEach(function (t) {
      const c = traer(paraLeer(t));
      if (c && ctx) decodificar(c).catch(function () {});
    });
  }

  function callarGrabada() {
    turno++;
    fuentes.forEach(function (f) { try { f.stop(); } catch (e) {} });
    fuentes = [];
    libreEn = 0;
  }

  function sonarClip(buf, detras) {
    const x = contexto();
    if (!x) return;
    const f = x.createBufferSource();
    f.buffer = buf;
    f.connect(x.destination);
    const t = Math.max(x.currentTime + 0.02, detras ? libreEn : 0);
    f.start(t);
    libreEn = t + buf.duration;
    fuentes.push(f);
    f.onended = function () { fuentes = fuentes.filter(function (g) { return g !== f; }); };
  }

  // ---------- Voz del movil ----------

  function sintetizar(texto, sinCortar) {
    if (!window.speechSynthesis) return;
    try {
      if (!sinCortar) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = "es-ES";
      const v = vozElegida();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = prefs.velocidad;
      u.pitch = 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // sinCortar: no para lo que este sonando, se pone detras (para la cuenta).
  function hablar(texto, sinCortar) {
    const k = paraLeer(texto);
    if (!sinCortar) {
      callarGrabada();
      try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    }
    const c = usaGrabada() ? traer(k) : null;
    if (!c || c.fallo) { sintetizar(k, sinCortar); return; }
    if (c.buf) { sonarClip(c.buf, sinCortar); return; }
    const mio = turno;
    decodificar(c).then(function (buf) {
      if (mio === turno) sonarClip(buf, sinCortar);
    }, function () {
      if (mio === turno) sintetizar(k, sinCortar);
    });
  }

  let pendiente = null;
  // Con pitido, la voz entra justo despues para no pisarse con el.
  function decir(texto) {
    if (!prefs.voz || !texto) return;
    clearTimeout(pendiente);
    if (prefs.sonido) pendiente = setTimeout(function () { hablar(texto); }, 450);
    else hablar(texto);
  }

  // El numero de la repeticion. No corta lo que se este diciendo (el "Serie 2
  // de 3, vamos" del principio): se pone detras. Pero si lo de delante aun va
  // para largo, se lo salta, para que la cuenta no se quede atrasada.
  function contar(n) {
    if (!prefs.voz || !prefs.contar) return;
    if (usaGrabada() && ctx) {
      if (libreEn - ctx.currentTime > 0.7) return;
    } else {
      try { if (window.speechSynthesis && speechSynthesis.pending) return; } catch (e) {}
    }
    hablar(String(n), true);
  }

  // Desde un toque (boton "Probar"). Con la voz del movil, sin espera, para
  // que iOS la deje sonar. Con la grabada, el audio mudo se pone un momento
  // para que se oiga aunque este puesto el interruptor de silencio.
  const FRASE_PRUEBA = "Serie 2 de 3 · lado izquierdo · Vamos";
  function probar() {
    clearTimeout(pendiente);
    if (usaGrabada()) {
      contexto();
      sonarMudo();
      setTimeout(function () { if (!quiereCandado && mudo) mudo.pause(); }, 5000);
    }
    hablar(FRASE_PRUEBA);
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
    precargar: precargar,
    // Para las pruebas: si la frase ya esta cargada y lista para sonar.
    clipListo: function (t) { const c = clips[paraLeer(t)]; return !!(c && c.buf); },
    FRASE_PRUEBA: FRASE_PRUEBA,
    contar: contar,
    vocesEs: vocesEs,
    vozElegida: vozElegida,
    paraLeer: paraLeer,
    fase: function (f) { (porFase[f] || function () {})(); },
    cuenta: function () { tono(1320, 0.07, 0, 0.3); },
    fin: function () { tono(523, 0.18); tono(659, 0.18, 0.18); tono(784, 0.18, 0.36); tono(1047, 0.45, 0.54); vibrar([300, 100, 300, 100, 600]); }
  };
})();
