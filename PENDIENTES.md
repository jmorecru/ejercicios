# Pendientes

Última revisión: **18 de noviembre de 2026**. Versión: **1.0**, publicada en
<https://jmorecru.github.io/ejercicios/>.

> **Al desplegar, subir la versión.** `VERSION` y `VERSION_FECHA` en
> [js/version.js](js/version.js) y el `?v=...` de los `<script>` y del `<link>` de
> [index.html](index.html). Sin esto no hay forma de saber si el móvil ve lo último.

---

## 🎯 Lo siguiente: probarlo en el móvil

1. ~~Crear el repositorio y activar GitHub Pages~~ (hecho el 18-11-2026).
2. **Probar en el iPhone**, añadida a la pantalla de inicio:
   - que suenen los pitidos **con el interruptor de silencio puesto**;
   - que hable la voz (y si la voz en español suena bien);
   - que la pantalla no se apague durante un ejercicio;
   - que, si se bloquea el móvil a mitad, al volver el temporizador esté donde debe.
3. **Ajustar el ritmo por repetición** si 3 s se queda corto o largo en la práctica.

## Ideas para más adelante

- **Modo sesión**: encadenar todos los ejercicios del día sin volver a la lista. Tiene
  más sentido en la movilidad, que son 7 ejercicios cortos seguidos.
- **Funcionar sin conexión** con un *service worker*. No se ha puesto a propósito: con la
  app cambiando a menudo, una caché propia arriesga que el móvil se quede con una versión
  vieja. Los enlaces a vídeos necesitan internet igualmente.
- **Elegir el vídeo** concreto de cada ejercicio en lugar de una búsqueda, si alguna
  búsqueda saca resultados que no se parecen al ejercicio.

## Ya decidido

- **Sin registro de entrenamientos**: lo pidió el usuario. Solo se guardan preferencias.
- **El día se elige al abrir la app**, no va atado a días de la semana.
- **Los ejercicios 13 (peso muerto rumano) y M6 (chin tuck)** llevan el aviso de
  repasarlos con un profesional antes de hacerlos. Si no se validan, se sustituyen.
- **Foto del nº 20**: es la única de free-exercise-db con la apertura con banda sin
  anclaje (*Back Flyes - With Bands* ata la banda a un poste). Se ha desenfocado el
  rótulo del gimnasio.
- **Duración de la movilidad**: el plan dice 5-8 min, pero sus propias series suman
  unos 11; con la preparación y los cambios de ejercicio, la app calcula ≈ 13 min.

## Ya comprobado

- `pruebas/correr.ps1`: 38 comprobaciones sin fallos. Recorre los 31 ejercicios con un
  reloj falso, prueba pausa, +10 s, Hecho, el salto tras bloquear el móvil, el descanso
  de 90 s antes del finisher y el final del día.
- Pantallas revisadas en captura a 360 px de ancho.
