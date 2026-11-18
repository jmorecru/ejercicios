// Banco de pruebas. Se pega al final del index.html y lo lanza pruebas/correr.ps1
// en Edge sin ventana. Cada linea acaba en OK o en *** MAL ***.
//
// El temporizador se prueba con un reloj falso: se sustituye 'ahora' y se hace
// avanzar el tiempo a mano, asi una sesion entera tarda milisegundos.
(function () {
  const out = [];
  function log(s) { out.push(s); }
  function ok(c) { return c ? "OK" : "*** MAL ***"; }
  function prueba(nombre, fn) {
    try { fn(); } catch (e) { log("EXCEPCION en " + nombre + ": " + e.message); }
  }
  try { localStorage.removeItem(CLAVE); } catch (e) {}
  guardado = { ajustes: {}, sonido: false, voz: false, ritmo: 3, ultimoDia: null };
  avisos.prefs.sonido = false;
  avisos.prefs.voz = false;

  let reloj = 1000000;
  ahora = function () { return reloj; };
  function pasa(seg) { reloj += seg * 1000; tick(); }
  const sumaSeg = function (ps) { return ps.reduce(function (t, p) { return t + p.seg; }, 0); };
  const de = function (ps, fase) { return ps.filter(function (p) { return p.fase === fase; }); };

  prueba("datos", function () {
    log("[datos]");
    log("31 ejercicios con pauta: " + ok(PLAN.ejercicios.length === 31 && PLAN.ejercicios.every(function (e) { return !!e.pauta; })));
    log("ids sin repetir: " + ok(new Set(PLAN.ejercicios.map(function (e) { return e.id; })).size === 31));
    log("todos con imagen y busqueda de video: " + ok(PLAN.ejercicios.every(function (e) { return e.imagen && e.busquedas.length > 0; })));
    log("cada grupo es un dia que existe: " + ok(PLAN.ejercicios.every(function (e) { return !!diaPorId(e.grupo); })));
  });

  prueba("pasos", function () {
    log("[pasos de cada ejercicio]");
    let malos = [];
    PLAN.ejercicios.forEach(function (ej) {
      const ps = pasosDe(ej, {});
      const bien = ps[0].fase === "prepara" &&
        ps.every(function (p) { return Number.isInteger(p.seg) && p.seg > 0 && p.titulo && p.detalle && p.siguiente; }) &&
        ["trabajo", "aguanta"].indexOf(ps[ps.length - 1].fase) >= 0 &&
        ps.every(function (p, i) { return i === 0 || !(p.fase === "descanso" && ps[i - 1].fase === "descanso"); }) &&
        ps.every(function (p) { return (p.detalle + p.siguiente + p.voz).indexOf("undefined") < 0; });
      if (!bien) malos.push(ej.id);
    });
    log("todos empiezan preparando, acaban trabajando y no tienen huecos: " + ok(malos.length === 0) + (malos.length ? " (" + malos.join(", ") + ")" : ""));

    const f1 = pasosDe(ejPorId("f1"));
    log("f1: 6 rondas de 30 s y 5 descansos de 30 s: " + ok(de(f1, "trabajo").length === 6 && de(f1, "descanso").length === 5 && sumaSeg(de(f1, "trabajo")) === 180));
    log("f1: alterna marcha y sentadilla: " + ok(/Marcha/.test(de(f1, "trabajo")[0].detalle) && /Sentadilla/.test(de(f1, "trabajo")[1].detalle)));
    const f4 = pasosDe(ejPorId("f4"));
    log("f4: 8 min de circuito (8 x 40 s + 7 x 20 s): " + ok(sumaSeg(f4) - 10 === 460 && de(f4, "trabajo").length === 8));
    log("f4: rota los tres ejercicios: " + ok(/Mountain/.test(de(f4, "trabajo")[1].detalle) && /Sentadilla/.test(de(f4, "trabajo")[2].detalle) && /Marcha/.test(de(f4, "trabajo")[3].detalle)));

    const p01 = pasosDe(ejPorId("01"));
    log("01: 3 series de 12 reps a 3 s, 2 descansos de 60 s: " + ok(de(p01, "trabajo").length === 3 && de(p01, "trabajo")[0].seg === 36 && de(p01, "descanso").length === 2 && de(p01, "descanso")[0].seg === 60));
    const p02 = pasosDe(ejPorId("02"));
    log("02 (alternos, 5 s): 8 por lado = 16 reps = 80 s: " + ok(de(p02, "trabajo")[0].seg === 80));
    const p11 = pasosDe(ejPorId("11"));
    log("11 (cada serie): 2 series x 2 lados, 2 cambios: " + ok(de(p11, "trabajo").length === 4 && de(p11, "cambio").length === 2 && /izquierdo/.test(de(p11, "trabajo")[0].detalle)));
    const p12 = pasosDe(ejPorId("12"));
    const d12 = de(p12, "descanso");
    log("12 (bloque): 6 series, el descanso del medio avisa del cambio de pierna: " + ok(de(p12, "trabajo").length === 6 && d12.length === 5 && /pierna derecha/.test(d12[2].detalle)));
    const p21 = pasosDe(ejPorId("21"));
    log("21 (circuito): 2 rondas de 3 bloques, 1 descanso, 4 cambios: " + ok(de(p21, "trabajo").length === 6 && de(p21, "descanso").length === 1 && de(p21, "cambio").length === 4));
    const m5 = pasosDe(ejPorId("m5"));
    log("m5: 2 x 10 aguantes de 5 s: " + ok(de(m5, "aguanta").length === 20 && de(m5, "aguanta").every(function (p) { return p.seg === 5 && p.micro; })));
    const m7 = pasosDe(ejPorId("m7"));
    log("m7: 3 direcciones x 3 aguantes: " + ok(de(m7, "aguanta").length === 9 && /hacia la derecha/.test(de(m7, "aguanta")[8].detalle)));

    const a = pasosDe(ejPorId("01"), { reps: 15, descanso: 45 });
    log("los ajustes cambian reps y descanso: " + ok(de(a, "trabajo")[0].seg === 45 && de(a, "descanso")[0].seg === 45));
    const r = pasosDe(ejPorId("01"), { ritmo: 4 });
    log("el ritmo general cambia la duracion: " + ok(de(r, "trabajo")[0].seg === 48));
    log("pero no pisa el ritmo propio del ejercicio (02): " + ok(de(pasosDe(ejPorId("02"), { ritmo: 4 }), "trabajo")[0].seg === 80));
  });

  prueba("pantallas", function () {
    log("[pantallas]");
    location.hash = "";
    ruta();
    log("inicio: un boton por dia (5): " + ok(document.querySelectorAll("#dias .dia-btn").length === 5));
    let feos = [];
    PLAN.dias.forEach(function (d) {
      pintarDia(d.id);
      const n = document.querySelectorAll("#lista li").length;
      if (n !== ejerciciosDe(d.id).length || /undefined|NaN/.test($("dia").textContent)) feos.push(d.id);
    });
    log("cada dia lista sus ejercicios sin undefined ni NaN: " + ok(feos.length === 0) + (feos.length ? " (" + feos.join(", ") + ")" : ""));
    feos = [];
    PLAN.ejercicios.forEach(function (ej) {
      pintarFicha(ej.id);
      const t = $("ficha").textContent;
      if (/undefined|NaN/.test(t) || $("ficha-enlaces").querySelectorAll("a").length !== 2 * ej.busquedas.length || !$("ficha-img").getAttribute("src")) feos.push(ej.id);
    });
    log("cada ficha tiene imagen, enlaces de video e imagenes y nada roto: " + ok(feos.length === 0) + (feos.length ? " (" + feos.join(", ") + ")" : ""));
    log("13 y m6 piden repasarlos antes: " + ok((pintarFicha("13"), !$("ficha-confirmar").hidden) && (pintarFicha("m6"), !$("ficha-confirmar").hidden) && (pintarFicha("01"), $("ficha-confirmar").hidden)));

    pintarFicha("01");
    const antes = duracionDe(fichaActual, ajustesDe(fichaActual));
    cambiarAjuste("reps", 1);
    log("el + de repeticiones sube a 13 y alarga el ejercicio: " + ok(ajustesDe(fichaActual).reps === 13 && duracionDe(fichaActual, ajustesDe(fichaActual)) > antes));
    delete guardado.ajustes["01"];
    log("resumenes: " + ["01", "02", "05", "11", "12", "f1", "21", "m5", "m7"].map(function (id) { return id + "=" + resumen(ejPorId(id)); }).join(" | "));
    log("duracion de cada dia: " + PLAN.dias.map(function (d) { return d.id + " " + minutos(duracionDia(d.id)); }).join(", "));
  });

  prueba("temporizador", function () {
    log("[temporizador con reloj falso]");
    let malos = [];
    PLAN.ejercicios.forEach(function (ej) {
      const ps = pasosDe(ej, {});
      empezarCrono(ej);
      for (let i = 0; i < ps.length - 1; i++) {
        if (crono.i !== i) { malos.push(ej.id + "@" + i); break; }
        pasa(ps[i].seg);
      }
      pasa(ps[ps.length - 1].seg);
      if (!crono.terminado || $("crono-fin").hidden) malos.push(ej.id + " no termina");
      pararCrono();
    });
    log("los 31 ejercicios recorren todos sus pasos y terminan: " + ok(malos.length === 0) + (malos.length ? " (" + malos.slice(0, 5).join(", ") + ")" : ""));

    const ej = ejPorId("01");
    empezarCrono(ej);
    pasa(10);
    log("tras prepararse, empieza la serie 1 en verde: " + ok(crono.pasos[crono.i].fase === "trabajo" && /fase-trabajo/.test($("crono").className) && /Serie 1 de 3/.test($("crono-detalle").textContent)));
    log("muestra la imagen del ejercicio mientras tanto: " + ok(/01\.jpg/.test($("crono-img").getAttribute("src"))));
    pausar(); pasa(100);
    log("en pausa el tiempo no corre: " + ok(crono.i === 1 && crono.pausado));
    pausar(); pasa(1);
    log("al seguir, quedan 35 s: " + ok($("crono-tiempo").textContent === "0:35"));
    saltar();
    log("Hecho salta al descanso: " + ok(crono.pasos[crono.i].fase === "descanso" && $("crono-tiempo").textContent === "1:00"));
    masTiempo();
    log("+10 s alarga el descanso: " + ok($("crono-tiempo").textContent === "1:10"));
    pasa(10000);
    log("si el movil se bloquea mucho rato, al volver ya esta terminado: " + ok(crono.terminado));
    log("y ofrece el siguiente ejercicio con su descanso: " + ok(/Bird dog/.test($("fin-texto").textContent) && !$("fin-siguiente").hidden));
    pararCrono();

    empezarCrono(ejPorId("05"));
    pasa(sumaSeg(pasosDe(ejPorId("05"))));
    log("antes del finisher el descanso es de 90 s: " + ok($("fin-cuenta").textContent === "1:30"));
    pasa(90);
    log("y al acabarlo avisa de que se puede seguir: " + ok(/Cuando quieras/.test($("fin-cuenta-txt").textContent)));
    pararCrono();

    empezarCrono(ejPorId("f1"));
    pasa(sumaSeg(pasosDe(ejPorId("f1"))));
    log("el ultimo del dia felicita y no ofrece siguiente: " + ok(/Has terminado/.test($("fin-texto").textContent) && $("fin-siguiente").hidden));
    pararCrono();
    log("al parar se cierra el temporizador: " + ok($("crono").hidden && !crono.activo));
  });

  const div = document.createElement("div");
  div.id = "resultado-prueba";
  div.textContent = out.join("\n");
  document.body.appendChild(div);
})();
