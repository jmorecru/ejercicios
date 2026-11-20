// Marca de version visible en pantalla.
//
// Sirve para comprobar de un vistazo si el movil ve lo ultimo que se publico o
// una copia en cache: con la app anadida a la pantalla de inicio del iPhone,
// iOS se queda facilmente con ficheros viejos.
//
// Se sube a mano en cada despliegue, porque no hay herramientas de compilacion.
// Hay que tocar dos sitios, y es adrede:
//
//   1. VERSION y VERSION_FECHA de este fichero, que es lo que se ve en pantalla.
//   2. El ?v=... de los <script> y del <link> del index.html, que es lo que
//      obliga al navegador a bajar los ficheros de nuevo.

const VERSION = "1.3";
const VERSION_FECHA = "2026-11-20";
