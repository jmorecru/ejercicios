// Plan de entrenamiento: datos de los ejercicios.
//
// Cada ejercicio trae el texto para leer (descripcion, objetivo, descanso) y,
// en 'pauta', lo mismo en numeros para que el temporizador sepa que hacer:
//
//   tipo "series":     series, reps [min, max] o seg [min, max], descanso_seg.
//                      lados: "alternos"   -> se alterna dentro de la serie (reps son por lado)
//                             "cada_serie" -> en cada serie, un lado y luego el otro
//                             "bloque"     -> todas las series de un lado y luego del otro
//                      seg_rep: segundos que lleva una repeticion, si no vale el ritmo general.
//                      mantener_seg / soltar_seg: repeticiones de aguantar y soltar.
//   tipo "intervalos": trabajo_seg / descanso_seg x rondas, rotando 'ejercicios'.
//   tipo "circuito":   rondas de varios 'bloques' seguidos, con descanso entre rondas.
//
// El temporizador empieza por el minimo del rango; en la ficha se puede subir.
// 'confirmar_antes' marca los ejercicios que conviene repasar con un profesional.
// 'imagen_es_esquema' = true cuando la imagen es un dibujo propio y no una foto.
const PLAN = {
  "dias": [
    {
      "id": "dia1",
      "titulo": "Día 1 — Tren inferior + core (A)",
      "corto": "Inferior + core (A)"
    },
    {
      "id": "dia2",
      "titulo": "Día 2 — Tren superior + core (A)",
      "corto": "Superior + core (A)"
    },
    {
      "id": "dia4",
      "titulo": "Día 4 — Tren inferior + core (B)",
      "corto": "Inferior + core (B)"
    },
    {
      "id": "dia5",
      "titulo": "Día 5 — Tren superior + core (B)",
      "corto": "Superior + core (B)"
    },
    {
      "id": "movilidad",
      "titulo": "Movilidad de cuello y espalda (diaria, 5-8 min)",
      "corto": "Cuello y espalda · diaria"
    }
  ],
  "semana": [
    "Día 1",
    "Día 2",
    "Día 3: descanso o caminata suave",
    "Día 4",
    "Día 5",
    "Días 6-7: descanso activo"
  ],
  "material": "Bandas elásticas, step (5-6 cm), mancuernas hasta 1,5 kg. Sin anclajes.",
  "descansos": {
    "principales": "60\" (baja a 45\" tras 2-4 semanas)",
    "aislamiento": "45\"",
    "core": "30-45\"",
    "entre_ejercicios": "60-90\"",
    "antes_del_finisher": "60-90\"",
    "entre_dias": "Mínimo 1 día de descanso entre sesiones de la misma zona (inferior / superior)"
  },
  "progresion": [
    "Tempo lento: por ejemplo 3 segundos bajando en sentadillas o flexiones.",
    "Más repeticiones o series cada 2 semanas.",
    "Menos descanso entre series: de 60\" a 45\".",
    "Trabajo unilateral (una pierna o un brazo) para aumentar la dificultad sin más peso.",
    "Bandas más gruesas o con más tensión, si se consigue alguna adicional más adelante."
  ],
  "cardio_extra": "20-30 minutos de caminata a paso ligero 2-3 veces por semana, fuera de los días de entrenamiento.",
  "ejercicios": [
    {
      "id": "01",
      "grupo": "dia1",
      "nombre": "Sentadilla con banda",
      "descripcion": "Banda bajo los pies, sujeta con las manos a la altura de los hombros (sin apoyarla en el cuello). Baja como una sentadilla normal manteniendo la tensión en la banda.",
      "objetivo": "3 series x 12-15 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/01.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "sentadilla con banda elástica ejercicio"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          12,
          15
        ]
      }
    },
    {
      "id": "02",
      "grupo": "dia1",
      "nombre": "Bird dog",
      "descripcion": "A cuatro apoyos, manos bajo los hombros y rodillas bajo la cadera, espalda neutra. Extiende a la vez un brazo hacia delante y la pierna contraria hacia atrás, hasta que queden en línea con el tronco. Mantén 1-2 segundos sin rotar la cadera ni arquear la espalda y vuelve. Alterna lados.",
      "objetivo": "3 series x 8 repeticiones por lado",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/02.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "bird dog ejercicio core"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          8,
          8
        ],
        "lados": "alternos",
        "seg_rep": 5
      }
    },
    {
      "id": "03",
      "grupo": "dia1",
      "nombre": "Zancada hacia atrás (reverse lunge)",
      "descripcion": "De pie, pies a la anchura de la cadera. Da un paso atrás y baja hasta que ambas rodillas formen unos 90°, con la rodilla trasera casi rozando el suelo. El peso queda en la pierna delantera y el tronco recto. Empuja con el talón delantero para subir y alterna piernas.",
      "objetivo": "3 series x 10 repeticiones por pierna",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/03.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "zancada hacia atrás reverse lunge ejercicio"
      ],
      "nota_imagen": "Foto con mancuernas; puedes hacerlo sin peso o con tus mancuernas de 1,5 kg.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          10,
          10
        ],
        "lados": "alternos"
      }
    },
    {
      "id": "04",
      "grupo": "dia1",
      "nombre": "Puente de glúteo con banda",
      "descripcion": "Tumbado boca arriba, banda por encima de las rodillas, sube la cadera apretando el glúteo en la parte alta.",
      "objetivo": "3 series x 15 repeticiones",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/04.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "puente de glúteo con banda elástica"
      ],
      "nota_imagen": "Foto sin banda; tú coloca la banda por encima de las rodillas.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          15
        ]
      }
    },
    {
      "id": "05",
      "grupo": "dia1",
      "nombre": "Plancha frontal",
      "descripcion": "Apoyo en antebrazos y puntas de los pies, cuerpo en línea recta, abdomen contraído y cuello neutro (mirada al suelo).",
      "objetivo": "3 series x 20-30 segundos",
      "descanso_seg": 45,
      "descanso": "30-45\"",
      "imagen": "images/ejercicios/05.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "plancha frontal ejercicio"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "seg": [
          20,
          30
        ]
      }
    },
    {
      "id": "f1",
      "grupo": "dia1",
      "nombre": "Finisher metabólico",
      "descripcion": "6 minutos alternando marcha rápida con rodillas altas (sin saltar: marcha en el sitio subiendo las rodillas a la altura de la cadera, con los brazos al ritmo) y sentadillas rápidas sin salto (con peso corporal, a ritmo ágil y con la espalda neutra). Rondas impares: marcha; rondas pares: sentadillas. Sin impacto, el objetivo es mantener el pulso alto.",
      "objetivo": "30\" trabajo / 30\" descanso x 6 rondas (6 min totales)",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/f1.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "marcha rápida rodillas altas en el sitio",
        "sentadilla con peso corporal técnica"
      ],
      "nota_imagen": "Arriba: marcha con rodillas altas (esquema). Abajo: sentadilla rápida (foto con las manos tras la cabeza; tú con la espalda neutra).",
      "tipo": "finisher",
      "temporizador": {
        "trabajo_seg": 30,
        "descanso_seg": 30,
        "rondas": 6,
        "alternar": [
          "Marcha rápida con rodillas altas",
          "Sentadilla rápida sin salto"
        ]
      },
      "pauta": {
        "tipo": "intervalos",
        "trabajo_seg": 30,
        "descanso_seg": 30,
        "rondas": 6,
        "ejercicios": [
          "Marcha rápida con rodillas altas",
          "Sentadilla rápida sin salto"
        ]
      }
    },
    {
      "id": "06",
      "grupo": "dia2",
      "nombre": "Flexiones (push-ups)",
      "descripcion": "Manos algo más anchas que los hombros, cuerpo recto, cuello neutro (mirada al suelo), bajas hasta casi rozar el suelo con el pecho. Si hace falta, apoya las rodillas al inicio.",
      "objetivo": "3 series x 8-12 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/06.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "flexiones de brazos técnica"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          8,
          12
        ]
      }
    },
    {
      "id": "07",
      "grupo": "dia2",
      "nombre": "Remo sentado con banda en los pies",
      "descripcion": "Sentado en el suelo con las piernas estiradas al frente (rodillas ligeramente flexionadas), pasa la banda por las plantas de los pies y sujeta los extremos con las manos, brazos estirados y espalda recta. Tira llevando los codos hacia atrás y juntando los omóplatos; vuelve despacio. Precaución: no redondees la espalda; si la lumbar se curva, siéntate sobre un cojín o toalla doblada y flexiona más las rodillas.",
      "objetivo": "3 series x 12-15 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/07.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "remo sentado con banda elástica en los pies ejercicio"
      ],
      "nota_imagen": "Foto con polea; con la banda en los pies el movimiento es el mismo.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          12,
          15
        ]
      }
    },
    {
      "id": "08",
      "grupo": "dia2",
      "nombre": "Press de hombro con mancuernas (sentado)",
      "descripcion": "Sentado en una silla, mancuernas a la altura de los hombros, empuja hacia arriba hasta extender los brazos sin arquear la zona lumbar. Mantén el abdomen firme y los hombros lejos de las orejas.",
      "objetivo": "3 series x 12-15 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/08.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "press de hombro con mancuernas sentado"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          12,
          15
        ]
      }
    },
    {
      "id": "09",
      "grupo": "dia2",
      "nombre": "Curl de bíceps con banda",
      "descripcion": "De pie sobre la banda, brazos pegados al cuerpo, sube flexionando el codo controladamente.",
      "objetivo": "3 series x 15 repeticiones",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/09.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "curl de bíceps con banda elástica"
      ],
      "nota_imagen": "Foto con mancuernas; con banda es el mismo movimiento.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          15
        ]
      }
    },
    {
      "id": "10",
      "grupo": "dia2",
      "nombre": "Extensión de tríceps con banda (sin anclaje)",
      "descripcion": "De pie, o sentado en una silla con respaldo. Sujeta un extremo de la banda con una mano detrás de la espalda baja y el otro con la mano contraria por encima de la cabeza, con el codo flexionado y pegado a la oreja. Extiende el brazo de arriba hacia el techo sin mover el codo y vuelve despacio. Cambia de lado al terminar las series. Acorta la banda con la mano si necesitas más tensión. Mantén el abdomen firme y evita arquear la zona lumbar.",
      "objetivo": "3 series x 15 repeticiones",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/10.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "extensión de tríceps con banda elástica sin anclaje una mano atrás"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          15
        ],
        "lados": "bloque",
        "nombres_lados": [
          "brazo izquierdo",
          "brazo derecho"
        ]
      }
    },
    {
      "id": "11",
      "grupo": "dia2",
      "nombre": "Plancha lateral",
      "descripcion": "Apoyo en un antebrazo, cuerpo lateral en línea recta, cadera elevada sin caer.",
      "objetivo": "2 series x 20 segundos por lado",
      "descanso_seg": 30,
      "descanso": "30\"",
      "imagen": "images/ejercicios/11.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "plancha lateral ejercicio"
      ],
      "pauta": {
        "tipo": "series",
        "series": 2,
        "descanso_seg": 30,
        "seg": [
          20,
          20
        ],
        "lados": "cada_serie",
        "nombres_lados": [
          "lado izquierdo",
          "lado derecho"
        ]
      }
    },
    {
      "id": "12",
      "grupo": "dia4",
      "nombre": "Sentadilla split (zancada estática)",
      "descripcion": "Posición de zancada con un pie delante y otro detrás, pies fijos en el suelo. Baja en vertical hasta que la rodilla trasera casi toque el suelo y sube sin mover los pies. Completa las series de una pierna y cambia.",
      "objetivo": "3 series x 10 repeticiones por pierna",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/12.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "sentadilla split zancada estática"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          10,
          10
        ],
        "lados": "bloque",
        "nombres_lados": [
          "pierna izquierda",
          "pierna derecha"
        ]
      }
    },
    {
      "id": "13",
      "grupo": "dia4",
      "nombre": "Peso muerto rumano con banda",
      "descripcion": "Piernas ligeramente flexionadas, cadera hacia atrás, baja la banda deslizando por las piernas solo hasta la rodilla (recorrido corto), manteniendo la espalda neutra sin redondear. Precaución: si notas molestias en la espalda, detente y consulta a un profesional.",
      "objetivo": "3 series x 12-15 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/13.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "peso muerto rumano con banda elástica"
      ],
      "nota_imagen": "Foto con barra y mucho recorrido; tú con banda y solo hasta la rodilla.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          12,
          15
        ]
      },
      "confirmar_antes": true
    },
    {
      "id": "14",
      "grupo": "dia4",
      "nombre": "Elevación de gemelos",
      "descripcion": "Con las puntas de los pies en el borde del step (5-6 cm vale) o directamente en el suelo, sube y baja los talones de forma controlada. Puedes apoyar una mano en la pared para el equilibrio.",
      "objetivo": "3 series x 15-20 repeticiones",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/14.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "elevación de gemelos de pie ejercicio"
      ],
      "nota_imagen": "Foto con mancuernas y desde atrás; tú sin peso.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          20
        ]
      }
    },
    {
      "id": "15",
      "grupo": "dia4",
      "nombre": "Abducción de cadera con banda",
      "descripcion": "De pie o tumbado de lado, banda en los tobillos, separa la pierna hacia el lateral.",
      "objetivo": "3 series x 15 repeticiones por lado",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/15.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "abducción de cadera con banda elástica"
      ],
      "nota_imagen": "Foto sin banda; tú con la banda en los tobillos.",
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          15
        ],
        "lados": "cada_serie",
        "nombres_lados": [
          "pierna izquierda",
          "pierna derecha"
        ]
      }
    },
    {
      "id": "16",
      "grupo": "dia4",
      "nombre": "Dead bug",
      "descripcion": "Tumbado boca arriba, brazos extendidos hacia el techo y caderas y rodillas a 90°. Baja a la vez un brazo y la pierna contraria hacia el suelo sin que la zona lumbar se despegue del suelo, vuelve y alterna. Si la espalda se arquea, reduce el recorrido.",
      "objetivo": "3 series x 8 repeticiones por lado",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/16.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "dead bug ejercicio abdominal"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          8,
          8
        ],
        "lados": "alternos",
        "seg_rep": 4
      }
    },
    {
      "id": "f4",
      "grupo": "dia4",
      "nombre": "Finisher metabólico — circuito 8 min",
      "descripcion": "Marcha rápida con rodillas altas: en el sitio, sin saltar, subiendo las rodillas a la altura de la cadera. Mountain climbers: en posición de plancha alta, lleva las rodillas al pecho alternando, con el abdomen firme, la cadera estable y el cuello neutro. Si te molestan, hazlos más lentos o cámbialos por plancha con elevación de rodilla. Sentadilla rápida sin salto: sentadilla con peso corporal a ritmo ágil, con la espalda neutra.",
      "objetivo": "40\" trabajo / 20\" descanso, rotando entre los 3 ejercicios durante 8 min (aprox. 2-3 vueltas)",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/f4.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "marcha rápida rodillas altas en el sitio",
        "mountain climbers ejercicio",
        "sentadilla con peso corporal técnica"
      ],
      "nota_imagen": "Arriba: rodillas altas (esquema). Centro: mountain climbers. Abajo: sentadilla rápida (sin salto).",
      "tipo": "finisher",
      "temporizador": {
        "trabajo_seg": 40,
        "descanso_seg": 20,
        "duracion_min": 8,
        "rotar": [
          "Marcha rápida con rodillas altas",
          "Mountain climbers",
          "Sentadilla rápida sin salto"
        ]
      },
      "pauta": {
        "tipo": "intervalos",
        "trabajo_seg": 40,
        "descanso_seg": 20,
        "rondas": 8,
        "ejercicios": [
          "Marcha rápida con rodillas altas",
          "Mountain climbers",
          "Sentadilla rápida sin salto"
        ]
      }
    },
    {
      "id": "17",
      "grupo": "dia5",
      "nombre": "Press de pecho en suelo con mancuernas",
      "descripcion": "Tumbado boca arriba, mancuernas a la altura del pecho, empuja hacia arriba extendiendo los brazos.",
      "objetivo": "3 series x 12-15 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/17.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "press de pecho en suelo con mancuernas"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          12,
          15
        ]
      }
    },
    {
      "id": "18",
      "grupo": "dia5",
      "nombre": "Jalón con banda sin anclaje",
      "descripcion": "De pie, sujeta la banda con ambas manos por encima de la cabeza, brazos estirados y manos más separadas que los hombros. Tira de los extremos hacia los lados mientras bajas los codos hacia las costillas, hasta que las manos queden a la altura de los hombros; vuelve despacio. Mantén el abdomen firme y las costillas hacia abajo, sin arquear la zona lumbar.",
      "objetivo": "3 series x 15 repeticiones",
      "descanso_seg": 60,
      "descanso": "60\"",
      "imagen": "images/ejercicios/18.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "jalón con banda elástica sin anclaje"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 60,
        "reps": [
          15,
          15
        ]
      }
    },
    {
      "id": "19",
      "grupo": "dia5",
      "nombre": "Elevaciones laterales con mancuernas",
      "descripcion": "De pie, brazos a los lados, sube los brazos hasta la altura de los hombros con una leve flexión de codo, sin encoger los hombros hacia las orejas.",
      "objetivo": "3 series x 15 repeticiones",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/19.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "elevaciones laterales con mancuernas"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          15
        ]
      }
    },
    {
      "id": "20",
      "grupo": "dia5",
      "nombre": "Apertura con banda (band pull-apart)",
      "descripcion": "De pie, pies a la anchura de los hombros y abdomen firme. Sujeta la banda con ambas manos, brazos estirados al frente a la altura del pecho o de la cara, manos algo más separadas que los hombros. Sepárala hacia los lados hasta que los brazos queden en cruz y la banda roce el pecho, juntando los omóplatos; vuelve despacio. Con los codos altos (a la altura de los hombros) trabaja más la parte trasera del hombro, como el face pull. Muy bueno para la salud del hombro.",
      "objetivo": "3 series x 15 repeticiones",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/20.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "apertura con banda elástica band pull apart ejercicio"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          15,
          15
        ]
      }
    },
    {
      "id": "21",
      "grupo": "dia5",
      "nombre": "Curl martillo + tríceps patada trasera (apoyada)",
      "descripcion": "Curl martillo: agarre neutro (palmas mirándose), flexiona el codo. Patada de tríceps (apoyada): apoya una mano y la rodilla del mismo lado en una silla o sofá firme, espalda neutra y paralela al suelo, y extiende el brazo libre hacia atrás con el codo fijo. Cambia de lado al terminar.",
      "objetivo": "2 rondas de 12 repeticiones de cada ejercicio",
      "descanso_seg": 45,
      "descanso": "45\" entre rondas",
      "imagen": "images/ejercicios/21.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "curl martillo con mancuernas",
        "patada de tríceps con mancuerna apoyada en banco"
      ],
      "nota_imagen": "Arriba: curl martillo. Abajo: patada de tríceps apoyada (foto con banco; tú en silla o sofá).",
      "pauta": {
        "tipo": "circuito",
        "rondas": 2,
        "descanso_seg": 45,
        "cambio_seg": 10,
        "bloques": [
          {
            "nombre": "Curl martillo",
            "reps": 12
          },
          {
            "nombre": "Patada de tríceps, brazo derecho",
            "reps": 12
          },
          {
            "nombre": "Patada de tríceps, brazo izquierdo",
            "reps": 12
          }
        ]
      }
    },
    {
      "id": "22",
      "grupo": "dia5",
      "nombre": "Plancha con toque de hombro",
      "descripcion": "En posición de plancha alta (brazos extendidos), toca el hombro contrario con la mano alternando lados, manteniendo la cadera estable sin balancearse y el cuello neutro.",
      "objetivo": "3 series x 20 repeticiones (10 por lado)",
      "descanso_seg": 45,
      "descanso": "45\"",
      "imagen": "images/ejercicios/22.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "plancha con toque de hombro"
      ],
      "pauta": {
        "tipo": "series",
        "series": 3,
        "descanso_seg": 45,
        "reps": [
          10,
          10
        ],
        "lados": "alternos"
      }
    },
    {
      "id": "m1",
      "grupo": "movilidad",
      "nombre": "Inclinación lateral suave del cuello (trapecio superior)",
      "descripcion": "Sentado con la espalda recta, agarra el borde de la silla con la mano del lado que estiras. Inclina la oreja hacia el hombro contrario despacio, sin tirar con la mano ni subir el hombro. Respira con calma.",
      "objetivo": "2 series x 20-30 segundos por lado",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m1.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "estiramiento trapecio superior cuello sentado"
      ],
      "nota_imagen": "En la foto se ayuda con la mano; tú inclina el cuello sin tirar.",
      "pauta": {
        "tipo": "series",
        "series": 2,
        "descanso_seg": 10,
        "seg": [
          20,
          30
        ],
        "lados": "cada_serie",
        "nombres_lados": [
          "lado izquierdo",
          "lado derecho"
        ]
      }
    },
    {
      "id": "m2",
      "grupo": "movilidad",
      "nombre": "Estiramiento de pectoral en el marco de la puerta",
      "descripcion": "Apoya el antebrazo en el marco con el codo a la altura del hombro y da un paso suave hacia delante hasta notar el estiramiento en el pecho. No arquees la zona lumbar.",
      "objetivo": "2 series x 30 segundos por lado",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m2.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "estiramiento pectoral en marco de puerta"
      ],
      "pauta": {
        "tipo": "series",
        "series": 2,
        "descanso_seg": 10,
        "seg": [
          30,
          30
        ],
        "lados": "cada_serie",
        "nombres_lados": [
          "lado izquierdo",
          "lado derecho"
        ]
      }
    },
    {
      "id": "m3",
      "grupo": "movilidad",
      "nombre": "Apertura de tórax tumbado de lado (libro abierto)",
      "descripcion": "Tumbado de lado con las rodillas flexionadas y los brazos extendidos juntos al frente. Abre el brazo de arriba hacia atrás hasta donde sea cómodo, sin forzar, y vuelve. Si te marea seguir la mano con la mirada, mira al frente.",
      "objetivo": "8 repeticiones por lado",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m3.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "libro abierto movilidad torácica tumbado de lado"
      ],
      "pauta": {
        "tipo": "series",
        "series": 1,
        "descanso_seg": 10,
        "reps": [
          8,
          8
        ],
        "lados": "bloque",
        "nombres_lados": [
          "lado izquierdo",
          "lado derecho"
        ],
        "seg_rep": 5
      }
    },
    {
      "id": "m4",
      "grupo": "movilidad",
      "nombre": "Gato-camello suave",
      "descripcion": "A cuatro apoyos, con la cabeza en línea con la columna. Redondea y arquea la espalda con un rango pequeño y controlado, sin forzar.",
      "objetivo": "8-10 repeticiones lentas",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m4.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "gato camello ejercicio movilidad columna"
      ],
      "pauta": {
        "tipo": "series",
        "series": 1,
        "descanso_seg": 10,
        "reps": [
          8,
          10
        ],
        "seg_rep": 5
      }
    },
    {
      "id": "m5",
      "grupo": "movilidad",
      "nombre": "Retracción escapular (juntar los omóplatos)",
      "descripcion": "Sentado o de pie, con los brazos a los lados. Junta y baja los omóplatos, como si los guardaras en los bolsillos traseros, y mantén 5 segundos sin subir los hombros.",
      "objetivo": "2 series x 10 repeticiones de 5 segundos",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m5.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "retracción escapular ejercicio juntar omóplatos"
      ],
      "pauta": {
        "tipo": "series",
        "series": 2,
        "descanso_seg": 15,
        "reps": [
          10,
          10
        ],
        "mantener_seg": [
          5,
          5
        ],
        "soltar_seg": 2
      }
    },
    {
      "id": "m6",
      "grupo": "movilidad",
      "nombre": "Retracción cervical suave (chin tuck)",
      "descripcion": "Mirando al frente, lleva la barbilla hacia atrás en horizontal, como si hicieras papada, sin inclinar la cabeza. Mantén 3-5 segundos y suelta. Movimiento pequeño y sin dolor.",
      "objetivo": "10 repeticiones de 3-5 segundos",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m6.jpg",
      "imagen_es_esquema": true,
      "busquedas": [
        "retracción cervical chin tuck ejercicio"
      ],
      "pauta": {
        "tipo": "series",
        "series": 1,
        "descanso_seg": 10,
        "reps": [
          10,
          10
        ],
        "mantener_seg": [
          3,
          5
        ],
        "soltar_seg": 3
      },
      "confirmar_antes": true
    },
    {
      "id": "m7",
      "grupo": "movilidad",
      "nombre": "Isométricos cervicales suaves",
      "descripcion": "Sentado, apoya la mano en la frente o en un lado de la cabeza y empuja con una fuerza muy baja (20-30 %) durante 5 segundos, sin mover el cuello y respirando con normalidad. Hazlo hacia delante y hacia cada lado; no hacia atrás.",
      "objetivo": "3 repeticiones de 5 segundos en cada dirección",
      "descanso_seg": null,
      "descanso": null,
      "imagen": "images/ejercicios/m7.jpg",
      "imagen_es_esquema": false,
      "busquedas": [
        "isométricos cervicales suaves ejercicio"
      ],
      "nota_imagen": "Foto hacia un lado; haz lo mismo hacia delante, con la mano en la frente.",
      "pauta": {
        "tipo": "series",
        "series": 1,
        "descanso_seg": 10,
        "reps": [
          3,
          3
        ],
        "mantener_seg": [
          5,
          5
        ],
        "soltar_seg": 3,
        "lados": "bloque",
        "nombres_lados": [
          "hacia delante",
          "hacia la izquierda",
          "hacia la derecha"
        ]
      }
    }
  ],
  "calentamiento": "Calienta 5 minutos antes de cada sesión: la rutina de movilidad o marcha suave en el sitio.",
  "descanso_entre_ejercicios_seg": 60,
  "descanso_antes_finisher_seg": 90,
  "consejos": [
    "Prioriza la técnica sobre la velocidad, sobre todo las primeras 2-3 semanas.",
    "Respira: suelta el aire en el esfuerzo (al subir, empujar o tirar) y cógelo al bajar.",
    "Si necesitas más descanso, tómalo: mejor series bien hechas que deprisa.",
    "Si no tienes dónde enganchar la banda, sujétala con la mano o písala con el pie."
  ]
};
