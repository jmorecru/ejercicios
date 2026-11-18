// Convierte la 'pauta' de un ejercicio en la lista de pasos del temporizador.
//
// Un paso es { fase, seg, titulo, detalle, voz, micro }:
//   fase: "prepara" | "trabajo" | "aguanta" | "suelta" | "descanso" | "cambio"
//   micro: pasos cortos de aguantar/soltar, que solo pitan y no cuentan atras.
//
// Aqui no hay nada de pantalla ni de sonido: son funciones puras para que el
// banco de pruebas pueda recorrer todos los ejercicios sin esperar.

const PREPARA_SEG = 10;      // para colocarse antes de la primera serie
const CAMBIO_LADO_SEG = 5;   // cambiar de lado dentro de una serie
const RITMO_DEFECTO = 3;     // segundos por repeticion si el ejercicio no dice otra cosa

// Lo que el temporizador usa de verdad: la pauta con los ajustes del usuario
// encima (repeticiones, segundos, descanso y ritmo). Sin ajustes, el minimo.
function valoresDe(ej, ajustes) {
  const p = ej.pauta;
  const a = ajustes || {};
  const v = { descanso: a.descanso != null ? a.descanso : p.descanso_seg };
  if (p.tipo === "series") {
    if (p.reps) v.reps = a.reps != null ? a.reps : p.reps[0];
    if (p.seg) v.seg = a.seg != null ? a.seg : p.seg[0];
    if (p.mantener_seg) v.mantener = a.mantener != null ? a.mantener : p.mantener_seg[0];
    v.segRep = p.seg_rep || a.ritmo || RITMO_DEFECTO;
  }
  if (p.tipo === "circuito") v.segRep = a.ritmo || RITMO_DEFECTO;
  return v;
}

function nombreLados(p) {
  return p.nombres_lados || ["lado izquierdo", "lado derecho"];
}

function textoSerie(n, total) {
  return total > 1 ? "Serie " + n + " de " + total : "";
}

function unir() {
  return Array.prototype.filter.call(arguments, Boolean).join(" · ");
}

// Pasos de trabajo de una serie (o de un lado de una serie).
function pasosTrabajo(p, v, cabecera, lado) {
  const out = [];
  const voz = unir(cabecera, lado);
  if (v.mantener) {
    for (let r = 1; r <= v.reps; r++) {
      out.push({ fase: "aguanta", seg: v.mantener, micro: true,
                 titulo: "Aguanta", detalle: unir(cabecera, lado, "repetición " + r + " de " + v.reps),
                 voz: r === 1 ? unir(voz, "Aguanta") : "Aguanta" });
      if (r < v.reps) out.push({ fase: "suelta", seg: p.soltar_seg || 2, micro: true,
                                 titulo: "Suelta", detalle: unir(cabecera, lado, "luego repetición " + (r + 1) + " de " + v.reps),
                                 voz: "Suelta" });
    }
    return out;
  }
  if (v.seg) {
    out.push({ fase: "trabajo", seg: v.seg, titulo: "¡Vamos!",
               detalle: unir(cabecera, lado, v.seg + " segundos"), voz: unir(voz, "Vamos") });
    return out;
  }
  const reps = p.lados === "alternos" ? v.reps * 2 : v.reps;
  const txtReps = p.lados === "alternos" ? v.reps + " por lado, alternando" : v.reps + " repeticiones";
  out.push({ fase: "trabajo", seg: Math.round(reps * v.segRep), reps: true, titulo: "¡Vamos!",
             detalle: unir(cabecera, lado, txtReps), voz: unir(voz, "Vamos") });
  return out;
}

function pasosSeries(p, v) {
  const pasos = [];
  const lados = nombreLados(p);
  const bloques = p.lados === "bloque" ? lados : [null];
  bloques.forEach(function (ladoBloque, b) {
    for (let s = 1; s <= p.series; s++) {
      const cab = textoSerie(s, p.series);
      if (p.lados === "cada_serie") {
        lados.forEach(function (lado, i) {
          if (i > 0) pasos.push({ fase: "cambio", seg: CAMBIO_LADO_SEG, titulo: "Cambia",
                                  detalle: "Ahora " + lado, voz: "Cambia de lado" });
          Array.prototype.push.apply(pasos, pasosTrabajo(p, v, cab, lado));
        });
      } else {
        Array.prototype.push.apply(pasos, pasosTrabajo(p, v, cab, ladoBloque));
      }
      const ultimaDelBloque = s === p.series;
      const ultimoBloque = b === bloques.length - 1;
      if (ultimaDelBloque && ultimoBloque) continue;
      if (ultimaDelBloque) {
        pasos.push({ fase: "descanso", seg: v.descanso, titulo: "Descansa",
                     detalle: "Y cambia: ahora " + bloques[b + 1],
                     voz: "Descansa. Luego, " + bloques[b + 1] });
      } else {
        pasos.push({ fase: "descanso", seg: v.descanso, titulo: "Descansa",
                     detalle: "Luego, serie " + (s + 1) + " de " + p.series, voz: "Descansa" });
      }
    }
  });
  return pasos;
}

function pasosIntervalos(p) {
  const pasos = [];
  const n = p.ejercicios.length;
  for (let r = 1; r <= p.rondas; r++) {
    const ej = p.ejercicios[(r - 1) % n];
    pasos.push({ fase: "trabajo", seg: p.trabajo_seg, titulo: "¡Vamos!",
                 detalle: unir("Ronda " + r + " de " + p.rondas, ej), voz: ej });
    if (r < p.rondas) {
      pasos.push({ fase: "descanso", seg: p.descanso_seg, titulo: "Descansa",
                   detalle: "Luego, " + p.ejercicios[r % n], voz: "Descansa" });
    }
  }
  return pasos;
}

function pasosCircuito(p, v) {
  const pasos = [];
  for (let r = 1; r <= p.rondas; r++) {
    p.bloques.forEach(function (bl, i) {
      if (i > 0) pasos.push({ fase: "cambio", seg: p.cambio_seg, titulo: "Cambia",
                              detalle: "Ahora " + bl.nombre, voz: "Cambia. " + bl.nombre });
      pasos.push({ fase: "trabajo", seg: Math.round(bl.reps * v.segRep), reps: true, titulo: "¡Vamos!",
                   detalle: unir("Ronda " + r + " de " + p.rondas, bl.nombre, bl.reps + " repeticiones"),
                   voz: i === 0 ? unir("Ronda " + r, bl.nombre) : "" });
    });
    if (r < p.rondas) pasos.push({ fase: "descanso", seg: v.descanso, titulo: "Descansa",
                                   detalle: "Luego, ronda " + (r + 1) + " de " + p.rondas, voz: "Descansa" });
  }
  return pasos;
}

// Lista completa, con el "prepárate" delante y un 'siguiente' en cada paso
// para enseñar en pantalla lo que viene.
function pasosDe(ej, ajustes) {
  const p = ej.pauta;
  const v = valoresDe(ej, ajustes);
  let cuerpo;
  if (p.tipo === "series") cuerpo = pasosSeries(p, v);
  else if (p.tipo === "intervalos") cuerpo = pasosIntervalos(p);
  else if (p.tipo === "circuito") cuerpo = pasosCircuito(p, v);
  else throw new Error("Pauta desconocida en " + ej.id + ": " + p.tipo);

  const primero = cuerpo[0];
  const pasos = [{ fase: "prepara", seg: PREPARA_SEG, titulo: "Prepárate",
                   detalle: "Empieza: " + primero.detalle, voz: "Prepárate. " + ej.nombre }].concat(cuerpo);
  pasos.forEach(function (paso, i) {
    const sig = pasos[i + 1];
    paso.siguiente = sig ? sig.titulo.replace("¡", "").replace("!", "") + " · " + sig.detalle : "Fin del ejercicio";
  });
  return pasos;
}

function duracionDe(ej, ajustes) {
  return pasosDe(ej, ajustes).reduce(function (t, p) { return t + p.seg; }, 0);
}

// "1:05", "0:09"
function reloj(seg) {
  seg = Math.max(0, Math.ceil(seg));
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

// "≈ 4 min"
function minutos(seg) {
  return "≈ " + Math.max(1, Math.round(seg / 60)) + " min";
}
