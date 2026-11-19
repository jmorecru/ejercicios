# Ejercicios en casa

App web para seguir un plan de entrenamiento en casa desde el móvil: eliges el día,
abres un ejercicio, pulsas **Empezar** y el temporizador te va avisando de cuándo
trabajar, cuándo descansar, cuándo cambiar de lado y cuándo has terminado.

Se puede añadir a la pantalla de inicio del móvil y funciona como una app.

## Qué hace

- **Inicio**: un botón por día de entrenamiento (Día 1, 2, 4 y 5) y otro para la
  rutina de movilidad diaria, con el número de ejercicios y el tiempo aproximado.
- **Día**: la lista de ejercicios, con miniatura, pauta y duración.
- **Ficha**: la imagen de referencia (se amplía al tocarla), la descripción, enlaces a
  vídeos y a más imágenes, y botones para ajustar repeticiones, segundos y descanso.
- **Temporizador** a pantalla completa:
  - el color cambia con la fase: naranja para prepararse, verde para trabajar, azul
    para descansar y morado para cambiar de lado;
  - avisa con pitidos (y cuenta atrás de 3-2-1), con voz y, en Android, con vibración;
  - la imagen del ejercicio sigue a la vista;
  - **Pausa**, **+10 s** y **Hecho** para adelantar cuando acabas la serie antes;
  - mantiene la pantalla encendida mientras corre;
  - al terminar ofrece el siguiente ejercicio con la cuenta del descanso entre
    ejercicios (60 s, o 90 s antes del finisher).

Lo único que se guarda en el móvil son preferencias: los ajustes de cada ejercicio,
pitidos y voz, el ritmo por repetición y el último día abierto. No hay registro de
entrenamientos ni se envía nada a ningún sitio.

## Cómo funciona por dentro

HTML, CSS y JavaScript sin frameworks ni compilación. Los scripts se cargan como
scripts clásicos para que la app también se abra con doble clic (`file://`).

| Fichero | Qué contiene |
|---|---|
| [data/ejercicios.js](data/ejercicios.js) | `PLAN`: los días, los 31 ejercicios con sus textos e imagen, y la `pauta` en números que usa el temporizador |
| [js/pautas.js](js/pautas.js) | Convierte una pauta en la lista de pasos (prepárate, trabajo, descanso, cambio…). Funciones puras |
| [js/sonido.js](js/sonido.js) | Pitidos, voz, vibración y pantalla encendida |
| [js/app.js](js/app.js) | Pantallas, navegación por `#/dia/…` y `#/ej/…`, y el temporizador |
| [js/version.js](js/version.js) | La versión que se ve en pantalla |

### La pauta de cada ejercicio

- `series`: series × repeticiones (`reps`) o × segundos (`seg`), con su descanso.
  Los lados pueden ir **alternos** (dentro de la serie), **en cada serie** (un lado y
  luego el otro) o **en bloque** (todas las series de un lado y luego del otro).
  Con `mantener_seg` cada repetición es "aguanta… suelta".
- `intervalos`: los finishers, trabajo / descanso × rondas rotando los ejercicios.
- `circuito`: varias partes seguidas por ronda (el nº 21).

El trabajo por repeticiones no tiene un final exacto, así que se estima con un ritmo
(3 s por repetición, ajustable en *Ajustes del temporizador*). Si acabas antes, pulsa
**Hecho**; si necesitas más, **+10 s**. El temporizador empieza por el mínimo del rango
del plan y desde la ficha se puede subir: así se progresa.

### Avisos en iPhone

- El interruptor de silencio callaría los pitidos: para evitarlo suena en bucle un
  audio mudo mientras corre el temporizador.
- La web no puede vibrar en iPhone; por eso el aviso es también de color y de voz.
- iOS ofrece en español voces "de efecto" (Eddy, Flo, Abuela…) que suenan a robot y a
  menudo salen las primeras. La app las descarta y elige la más natural, prefiriendo
  las *mejoradas* si están descargadas. En los ajustes se puede elegir otra voz y la
  velocidad (por defecto 0,85: en iPhone, la velocidad 1 ya suena deprisa).
- Lo que se lee no es exactamente lo que se ve: el " · " de la pantalla se convierte
  en pausa y lo que va entre paréntesis no se lee.

## Cómo ponerlo en marcha

- **En el ordenador**: doble clic en `index.html`.
- **Publicado**: <https://jmorecru.github.io/ejercicios/> (GitHub Pages desde la raíz
  de `main`).
- **Al desplegar, sube la versión** en dos sitios: `VERSION` y `VERSION_FECHA` en
  [js/version.js](js/version.js), y el `?v=` de los `<script>` y del `<link>` de
  [index.html](index.html).

### Pruebas

```
powershell -File pruebas\correr.ps1
```

Abre la app en Edge sin ventana y comprueba los datos, los pasos de cada ejercicio, las
pantallas y el temporizador con un reloj falso que recorre los 31 ejercicios en
milisegundos. Los iconos se regeneran con `powershell -File pruebas\iconos.ps1`.

---

No sustituye el consejo médico. Si notas dolor, hormigueo o mareo, para.
