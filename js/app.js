// Pantallas y temporizador.
//
// Navegacion por el hash (#/dia/dia1, #/ej/01) para que el boton de atras del
// movil funcione. El temporizador va encima, a pantalla completa.
//
// Lo unico que se guarda en el movil son preferencias: los ajustes de cada
// ejercicio (repeticiones, segundos, descanso), sonido, voz, ritmo y el ultimo
// dia elegido. No hay registro de entrenos ni sale nada del movil.

// Reloj del temporizador. El banco de pruebas lo cambia por uno falso.
let ahora = function () { return Date.now(); };

const $ = function (id) { return document.getElementById(id); };

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

// ---------- Preferencias guardadas ----------

const CLAVE = "ejercicios.v1";
let guardado = { ajustes: {}, sonido: true, voz: true, vozId: "", velocidad: 0.85, ritmo: 3, ultimoDia: null };

function cargar() {
  try {
    const t = localStorage.getItem(CLAVE);
    if (t) guardado = Object.assign(guardado, JSON.parse(t));
  } catch (e) {}
  avisos.prefs.sonido = guardado.sonido;
  avisos.prefs.voz = guardado.voz;
  avisos.prefs.vozId = guardado.vozId;
  avisos.prefs.velocidad = guardado.velocidad;
}

function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(guardado)); } catch (e) {}
}

function ajustesDe(ej) {
  return Object.assign({ ritmo: guardado.ritmo }, guardado.ajustes[ej.id] || {});
}

// ---------- Datos ----------

function ejerciciosDe(diaId) {
  return PLAN.ejercicios.filter(function (e) { return e.grupo === diaId; });
}

function diaPorId(id) {
  return PLAN.dias.filter(function (d) { return d.id === id; })[0];
}

function ejPorId(id) {
  return PLAN.ejercicios.filter(function (e) { return e.id === id; })[0];
}

function numeroDe(ej) {
  if (ej.pauta.tipo === "intervalos") return "Finisher";
  if (ej.grupo === "movilidad") return ej.id.toUpperCase();
  return String(parseInt(ej.id, 10));
}

// "3 × 12 reps · desc. 60 s"
function resumen(ej) {
  const p = ej.pauta;
  const v = valoresDe(ej, ajustesDe(ej));
  if (p.tipo === "intervalos") return p.rondas + " rondas · " + p.trabajo_seg + " s / " + p.descanso_seg + " s";
  if (p.tipo === "circuito") return p.rondas + " rondas de " + p.bloques.length + " · desc. " + v.descanso + " s";
  let t = p.series > 1 ? p.series + " × " : "";
  if (v.mantener) t += v.reps + " de " + v.mantener + " s";
  else if (v.seg) t += v.seg + " s";
  else t += v.reps;
  if (p.lados === "alternos" || p.lados === "cada_serie" || p.lados === "bloque") {
    t += p.lados === "alternos" ? " por lado" : " " + (p.nombres_lados && p.nombres_lados.length === 3 ? "en cada dirección" : "por lado");
  } else if (v.reps && !v.mantener) t += " reps";
  if (p.series > 1 || p.lados === "bloque") t += " · desc. " + v.descanso + " s";
  return t;
}

function duracionDia(diaId) {
  const ejs = ejerciciosDe(diaId);
  let t = 0;
  ejs.forEach(function (ej, i) {
    t += duracionDe(ej, ajustesDe(ej));
    if (i < ejs.length - 1) t += transicionAntes(ejs[i + 1]);
  });
  return t;
}

function transicionAntes(ej) {
  if (ej.grupo === "movilidad") return 10;
  return ej.pauta.tipo === "intervalos" ? PLAN.descanso_antes_finisher_seg : PLAN.descanso_entre_ejercicios_seg;
}

// ---------- Pantallas ----------

function mostrar(id) {
  ["inicio", "dia", "ficha"].forEach(function (p) { $(p).hidden = p !== id; });
  window.scrollTo(0, 0);
}

function pintarInicio() {
  $("dias").innerHTML = PLAN.dias.map(function (d) {
    const nombre = d.id === "movilidad" ? "Movilidad" : d.titulo.split("—")[0].trim();
    return '<a class="dia-btn' + (d.id === "movilidad" ? " movilidad" : "") + '" href="#/dia/' + d.id + '">' +
           "<b>" + esc(nombre) + "</b><span>" + esc(d.corto) + "</span>" +
           "<small>" + ejerciciosDe(d.id).length + " ejercicios · " + minutos(duracionDia(d.id)) + "</small></a>";
  }).join("");
  const u = guardado.ultimoDia && diaPorId(guardado.ultimoDia);
  $("ultimo").textContent = u ? "La última vez abriste: " + u.titulo.split("—")[0].trim() + " · " + u.corto : "";
  $("consejos").innerHTML = [PLAN.calentamiento].concat(PLAN.consejos).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
  $("pref-sonido").checked = guardado.sonido;
  $("pref-voz").checked = guardado.voz;
  $("pref-velocidad").value = String(guardado.velocidad);
  pintarVoces();
  $("pref-ritmo").textContent = guardado.ritmo;
  mostrar("inicio");
}

// Las voces llegan tarde (evento voiceschanged), asi que la lista se rehace
// cada vez que cambian. Si la voz guardada ya no esta, se ve "la mas natural".
function pintarVoces() {
  const sel = $("pref-voz-id");
  const voces = avisos.vocesEs();
  const mejor = voces[0] ? " (" + voces[0].name + ")" : "";
  sel.innerHTML = '<option value="">La más natural' + esc(mejor) + "</option>" +
    voces.map(function (v) {
      return '<option value="' + esc(v.voiceURI) + '">' + esc(v.name) + (v.lang === "es-ES" ? "" : " · " + esc(v.lang)) + "</option>";
    }).join("");
  sel.value = voces.some(function (v) { return v.voiceURI === guardado.vozId; }) ? guardado.vozId : "";
}

function pintarDia(diaId) {
  const d = diaPorId(diaId);
  if (!d) { location.hash = ""; return; }
  guardado.ultimoDia = diaId; guardar();
  $("dia-titulo").textContent = d.titulo;
  $("dia-resumen").textContent = minutos(duracionDia(diaId)) + " con los descansos";
  $("dia-calentamiento").textContent = diaId === "movilidad"
    ? "Hazla todos los días y también como calentamiento. Movimientos lentos y sin dolor."
    : PLAN.calentamiento;
  $("lista").innerHTML = ejerciciosDe(diaId).map(function (ej) {
    return '<li><a href="#/ej/' + ej.id + '">' +
           '<span class="mini" style="background-image:url(\'' + esc(ej.imagen) + '\')"></span>' +
           '<span class="txt"><small>' + esc(numeroDe(ej)) + "</small><b>" + esc(ej.nombre) + "</b>" +
           "<span>" + esc(resumen(ej)) + " · " + minutos(duracionDe(ej, ajustesDe(ej))) + "</span></span></a></li>";
  }).join("");
  mostrar("dia");
}

function urlVideo(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); }
function urlImagenes(q) { return "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q); }

let fichaActual = null;

function pintarFicha(id) {
  const ej = ejPorId(id);
  if (!ej) { location.hash = ""; return; }
  fichaActual = ej;
  const d = diaPorId(ej.grupo);
  $("ficha-volver").href = "#/dia/" + ej.grupo;
  $("ficha-num").textContent = d.titulo.split("—")[0].trim() + " · " + numeroDe(ej);
  $("ficha-nombre").textContent = ej.nombre;
  $("ficha-img").src = ej.imagen;
  $("ficha-img").alt = ej.nombre;
  $("ficha-nota").textContent = ej.nota_imagen ||
    (ej.imagen_es_esquema ? "Esquema orientativo; el vídeo muestra el movimiento real." : "");
  $("ficha-confirmar").hidden = !ej.confirmar_antes;
  $("ficha-objetivo").textContent = ej.objetivo + (ej.descanso ? " · Descanso: " + ej.descanso : "");
  $("ficha-desc").textContent = ej.descripcion;

  const varias = ej.busquedas.length > 1;
  const nombres = ej.pauta.ejercicios || (ej.pauta.bloques && ["Curl martillo", "Patada de tríceps"]) || [];
  $("ficha-enlaces").innerHTML = ej.busquedas.map(function (q, i) {
    const etiqueta = varias ? "<span>" + esc(nombres[i] || q) + "</span>" : "";
    return '<div class="enlace">' + etiqueta +
           '<a href="' + urlVideo(q) + '" target="_blank" rel="noopener">▶ Vídeo</a>' +
           '<a href="' + urlImagenes(q) + '" target="_blank" rel="noopener">🖼 Más imágenes</a></div>';
  }).join("");
  pintarAjustes(ej);
  mostrar("ficha");
}

// Pasos de los botones +/- de la ficha, por campo.
const CAMPOS = {
  reps:     { nombre: "Repeticiones", paso: 1, min: 1 },
  seg:      { nombre: "Segundos", paso: 5, min: 5 },
  mantener: { nombre: "Aguantar (s)", paso: 1, min: 1 },
  descanso: { nombre: "Descanso (s)", paso: 5, min: 5 }
};

function pintarAjustes(ej) {
  const p = ej.pauta;
  const v = valoresDe(ej, ajustesDe(ej));
  const filas = [];
  if (p.tipo === "series") {
    if (v.reps != null) filas.push(["reps", v.reps, p.reps, p.lados === "alternos" ? "por lado" : ""]);
    if (v.seg != null) filas.push(["seg", v.seg, p.seg, p.lados ? "por lado" : ""]);
    if (v.mantener != null) filas.push(["mantener", v.mantener, p.mantener_seg, ""]);
  }
  if (p.tipo !== "intervalos" && (p.series > 1 || p.lados === "bloque" || p.tipo === "circuito")) {
    filas.push(["descanso", v.descanso, null, ""]);
  }
  $("ficha-ajustes").innerHTML = filas.length ? "<h3>Ajusta</h3>" + filas.map(function (f) {
    const plan = f[2] ? (f[2][0] === f[2][1] ? f[2][0] : f[2][0] + "-" + f[2][1]) : "";
    return '<div class="fila-ajuste"><span>' + CAMPOS[f[0]].nombre + (f[3] ? " " + f[3] : "") +
           (plan ? "<br><small>Plan: " + plan + "</small>" : "") + "</span>" +
           '<span class="paso"><button type="button" data-campo="' + f[0] + '" data-d="-1" aria-label="Menos">−</button>' +
           "<b>" + f[1] + '</b><button type="button" data-campo="' + f[0] + '" data-d="1" aria-label="Más">+</button></span></div>';
  }).join("") + '<button type="button" id="ajustes-plan" class="enlace-btn">Volver a lo del plan</button>' : "";
  $("ficha-dur").textContent = "(" + minutos(duracionDe(ej, ajustesDe(ej))) + ")";
}

function cambiarAjuste(campo, d) {
  const ej = fichaActual;
  const v = valoresDe(ej, ajustesDe(ej));
  const c = CAMPOS[campo];
  const actual = v[campo];
  const a = guardado.ajustes[ej.id] || {};
  a[campo] = Math.max(c.min, actual + d * c.paso);
  guardado.ajustes[ej.id] = a;
  guardar();
  pintarAjustes(ej);
}

function ruta() {
  if (crono.activo) pararCrono();
  const h = location.hash.replace(/^#\/?/, "").split("/");
  if (h[0] === "dia" && h[1]) pintarDia(h[1]);
  else if (h[0] === "ej" && h[1]) pintarFicha(h[1]);
  else pintarInicio();
}

// ---------- Temporizador ----------

const crono = {
  activo: false, ej: null, pasos: [], i: 0, finPaso: 0, inicio: 0,
  pausado: false, restante: 0, total: 0, avisado: -1, intervalo: null,
  terminado: false, transicionFin: 0, transicionAvisada: false
};

function empezarCrono(ej) {
  avisos.activar();
  crono.activo = true;
  crono.terminado = false;
  crono.ej = ej;
  crono.pasos = pasosDe(ej, ajustesDe(ej));
  crono.total = crono.pasos.reduce(function (t, p) { return t + p.seg; }, 0);
  crono.i = 0;
  crono.pausado = false;
  crono.inicio = ahora();
  crono.finPaso = crono.inicio + crono.pasos[0].seg * 1000;
  $("crono-nombre").textContent = ej.nombre;
  $("crono-img").src = ej.imagen;
  $("crono-marcha").hidden = false;
  $("crono-fin").hidden = true;
  $("crono").hidden = false;
  $("crono-pausa").textContent = "⏸ Pausa";
  entrarPaso(true);
  clearInterval(crono.intervalo);
  crono.intervalo = setInterval(tick, 200);
  tick();
}

function pararCrono() {
  clearInterval(crono.intervalo);
  crono.activo = false;
  crono.terminado = false;
  $("crono").hidden = true;
  avisos.desactivar();
}

function entrarPaso(conAviso) {
  const p = crono.pasos[crono.i];
  crono.avisado = -1;
  $("crono").className = "crono fase-" + p.fase;
  $("crono-fase").textContent = p.titulo;
  $("crono-detalle").textContent = p.detalle;
  $("crono-luego").textContent = "Luego: " + p.siguiente;
  $("crono-hecho").textContent = p.fase === "trabajo" || p.fase === "aguanta" ? "Hecho ⏭" : "Saltar ⏭";
  if (conAviso) {
    avisos.fase(p.fase);
    avisos.decir(p.voz);
  }
}

// Avanza todos los pasos que ya han vencido. Si el movil estuvo bloqueado y han
// pasado varios, se salta en silencio hasta el que toca ahora.
function tick() {
  if (!crono.activo) return;
  const t = ahora();
  if (crono.terminado) { tickTransicion(t); return; }
  if (crono.pausado) return;
  let cambiado = false;
  while (t >= crono.finPaso) {
    crono.i++;
    if (crono.i >= crono.pasos.length) { terminar(); return; }
    crono.finPaso += crono.pasos[crono.i].seg * 1000;
    cambiado = true;
  }
  if (cambiado) entrarPaso(t < crono.finPaso);
  const p = crono.pasos[crono.i];
  const queda = (crono.finPaso - t) / 1000;
  const entero = Math.ceil(queda);
  if (!p.micro && p.seg >= 5 && entero <= 3 && entero >= 1 && entero !== crono.avisado) {
    crono.avisado = entero;
    avisos.cuenta();
  }
  $("crono-tiempo").textContent = reloj(queda);
  const hecho = crono.pasos.slice(0, crono.i).reduce(function (s, x) { return s + x.seg; }, 0) + (p.seg - queda);
  $("crono-barra").style.width = Math.min(100, 100 * hecho / crono.total) + "%";
}

function siguienteEj() {
  const ejs = ejerciciosDe(crono.ej.grupo);
  return ejs[ejs.indexOf(crono.ej) + 1] || null;
}

function terminar() {
  crono.terminado = true;
  avisos.fin();
  const sig = siguienteEj();
  $("crono").className = "crono fase-fin";
  $("crono-marcha").hidden = true;
  $("crono-fin").hidden = false;
  if (sig) {
    avisos.decir("Ejercicio terminado. Siguiente: " + sig.nombre);
    $("fin-texto").textContent = "Siguiente: " + sig.nombre;
    $("fin-siguiente").hidden = false;
    $("fin-siguiente").textContent = "Ir al siguiente ›";
    crono.transicionFin = ahora() + transicionAntes(sig) * 1000;
    crono.transicionAvisada = false;
    $("fin-cuenta-txt").textContent = "Descansa, cambia el material y bebe agua.";
    tickTransicion(ahora());
  } else {
    avisos.decir("Has terminado. ¡Bien hecho!");
    $("fin-texto").textContent = "Has terminado " + diaPorId(crono.ej.grupo).titulo.split("—")[0].trim() + ". ¡Bien hecho!";
    $("fin-siguiente").hidden = true;
    crono.transicionFin = 0;
    $("fin-cuenta").textContent = "";
    $("fin-cuenta-txt").textContent = "";
  }
}

function tickTransicion(t) {
  if (!crono.transicionFin) return;
  const queda = (crono.transicionFin - t) / 1000;
  if (queda > 0) {
    $("fin-cuenta").textContent = reloj(queda);
    return;
  }
  $("fin-cuenta").textContent = "0:00";
  if (!crono.transicionAvisada) {
    crono.transicionAvisada = true;
    $("fin-cuenta-txt").textContent = "Cuando quieras, al siguiente.";
    avisos.fase("cambio");
    avisos.decir("Cuando quieras, al siguiente");
  }
}

function pausar() {
  if (crono.terminado) return;
  if (crono.pausado) {
    crono.pausado = false;
    crono.finPaso = ahora() + crono.restante;
    $("crono-pausa").textContent = "⏸ Pausa";
    $("crono").classList.remove("pausado");
  } else {
    crono.pausado = true;
    crono.restante = crono.finPaso - ahora();
    $("crono-pausa").textContent = "▶ Seguir";
    $("crono").classList.add("pausado");
  }
}

function saltar() {
  if (crono.pausado) pausar();
  crono.finPaso = ahora();
  tick();
}

function masTiempo() {
  if (crono.pausado) crono.restante += 10000;
  else crono.finPaso += 10000;
  tick();
}

// ---------- Eventos ----------

function iniciarApp() {
  cargar();
  $("ver").textContent = VERSION + " · " + VERSION_FECHA;
  window.addEventListener("hashchange", ruta);

  $("empezar").addEventListener("click", function () { if (fichaActual) empezarCrono(fichaActual); });
  $("crono-parar").addEventListener("click", pararCrono);
  $("crono-pausa").addEventListener("click", pausar);
  $("crono-hecho").addEventListener("click", saltar);
  $("crono-mas").addEventListener("click", masTiempo);
  $("fin-volver").addEventListener("click", function () {
    const g = crono.ej.grupo;
    pararCrono();
    location.hash = "#/dia/" + g;
  });
  $("fin-siguiente").addEventListener("click", function () {
    const sig = siguienteEj();
    pararCrono();
    if (sig) location.hash = "#/ej/" + sig.id;
  });

  $("ficha-ajustes").addEventListener("click", function (e) {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.id === "ajustes-plan") {
      delete guardado.ajustes[fichaActual.id];
      guardar();
      pintarAjustes(fichaActual);
    } else if (b.dataset.campo) {
      cambiarAjuste(b.dataset.campo, parseInt(b.dataset.d, 10));
    }
  });

  $("pref-sonido").addEventListener("change", function () {
    guardado.sonido = avisos.prefs.sonido = this.checked; guardar();
  });
  $("pref-voz").addEventListener("change", function () {
    guardado.voz = avisos.prefs.voz = this.checked; guardar();
  });
  $("pref-voz-id").addEventListener("change", function () {
    guardado.vozId = avisos.prefs.vozId = this.value; guardar();
    avisos.probar();
  });
  $("pref-velocidad").addEventListener("change", function () {
    guardado.velocidad = avisos.prefs.velocidad = parseFloat(this.value); guardar();
    avisos.probar();
  });
  $("pref-probar").addEventListener("click", function () { avisos.probar(); });
  if (window.speechSynthesis && speechSynthesis.addEventListener) {
    speechSynthesis.addEventListener("voiceschanged", pintarVoces);
  }
  document.querySelectorAll("[data-ritmo]").forEach(function (b) {
    b.addEventListener("click", function () {
      guardado.ritmo = Math.min(8, Math.max(2, guardado.ritmo + parseInt(b.dataset.ritmo, 10)));
      guardar();
      pintarInicio();
    });
  });

  $("ficha-img").addEventListener("click", function () {
    $("visor-img").src = this.src;
    $("visor").hidden = false;
  });
  $("crono-img").addEventListener("click", function () {
    $("visor-img").src = this.src;
    $("visor").hidden = false;
  });
  $("visor").addEventListener("click", function () { this.hidden = true; });

  ruta();
}

iniciarApp();
