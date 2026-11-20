"""Graba con voz natural todas las frases que dice el temporizador.

    python pruebas/voces.py

Safari en iPhone no deja que una web use las voces buenas del sistema, asi que
las frases van grabadas como audio dentro de la app:

1. Abre la app en Edge sin ventana y le pide la lista de frases
   (frasesGrabables() en js/app.js), para no repetirla aqui.
2. Graba con edge-tts las que falten en audio/voz/ (voz y velocidad abajo).
   El nombre de cada fichero sale de la frase, la voz y la velocidad, asi que
   solo se graba lo nuevo y, si se cambia la voz, se graba todo otra vez.
3. Borra los audios que ya no se usan y escribe data/voces.js.

Necesita:  pip install edge-tts truststore
(truststore hace que Python use los certificados de Windows; sin el, en redes
que inspeccionan HTTPS falla la conexion).

Vuelve a lanzarlo siempre que cambien los ejercicios o las frases.
"""

import asyncio
import hashlib
import html
import json
import os
import re
import subprocess
import sys

VOZ = "es-ES-AlvaroNeural"
VELOCIDAD = "-5%"      # la que se eligio probando en Edge ("algo rapida")
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETA = os.path.join(RAIZ, "audio", "voz")
INDICE = os.path.join(RAIZ, "data", "voces.js")


def frases_de_la_app():
    with open(os.path.join(RAIZ, "index.html"), encoding="utf-8") as f:
        pagina = f.read()
    volcado = ('<script>document.body.insertAdjacentHTML("beforeend", \'<pre id="frases-grabables"></pre>\');'
               'try { document.getElementById("frases-grabables").textContent = JSON.stringify(frasesGrabables()); } catch (e) { document.getElementById("frases-grabables").textContent = "ERROR " + e.message; }</script>')
    copia = os.path.join(RAIZ, "_frases.html")
    with open(copia, "w", encoding="utf-8", newline="\n") as f:
        f.write(pagina.replace("</body>", volcado + "\n</body>"))
    try:
        perfil = os.path.join(os.environ.get("TEMP", RAIZ), "ejercicios-voces-edge")
        r = subprocess.run([EDGE, "--headless", "--disable-gpu", "--no-sandbox", "--mute-audio",
                            "--user-data-dir=" + perfil, "--virtual-time-budget=3000", "--dump-dom",
                            "file:///" + copia.replace("\\", "/")],
                           capture_output=True, timeout=120)
    finally:
        os.remove(copia)
    # La ultima: la primera es el propio texto del <script> de arriba.
    m = re.findall(r'<pre id="frases-grabables">(.*?)</pre>', r.stdout.decode("utf-8"), re.S)
    texto = html.unescape(m[-1]) if m else ""
    if not texto.startswith("["):
        sys.exit("La app no ha devuelto las frases (%s). Prueba pruebas/correr.ps1" % (texto or "nada"))
    return json.loads(texto)


def id_de(frase):
    return hashlib.sha1((VOZ + "|" + VELOCIDAD + "|" + frase).encode("utf-8")).hexdigest()[:12]


async def grabar(pendientes):
    try:
        import truststore
        truststore.inject_into_ssl()
    except ImportError:
        pass
    import edge_tts

    hueco = asyncio.Semaphore(4)

    async def una(frase, ruta):
        async with hueco:
            for intento in range(3):
                try:
                    await edge_tts.Communicate(frase, VOZ, rate=VELOCIDAD).save(ruta)
                    if os.path.getsize(ruta) > 0:
                        return
                except Exception as e:
                    error = e
                await asyncio.sleep(2)
            raise RuntimeError("No se ha podido grabar %r: %s" % (frase, error))

    await asyncio.gather(*(una(f, r) for f, r in pendientes))


def main():
    frases = frases_de_la_app()
    os.makedirs(CARPETA, exist_ok=True)
    mapa = {f: id_de(f) for f in frases}
    pendientes = [(f, os.path.join(CARPETA, i + ".mp3")) for f, i in mapa.items()
                  if not os.path.exists(os.path.join(CARPETA, i + ".mp3"))]
    print("%d frases, %d por grabar" % (len(frases), len(pendientes)))
    if pendientes:
        asyncio.run(grabar(pendientes))

    usados = {i + ".mp3" for i in mapa.values()}
    sobran = [n for n in os.listdir(CARPETA) if n.endswith(".mp3") and n not in usados]
    for n in sobran:
        os.remove(os.path.join(CARPETA, n))

    cabecera = ("// Frases grabadas del temporizador -> fichero en audio/voz/ (sin .mp3).\n"
                "// NO SE EDITA A MANO: lo genera pruebas/voces.py con la voz %s (%s).\n"
                "// La clave es el texto tal y como se lee (avisos.paraLeer).\n"
                "const VOCES = " % (VOZ, VELOCIDAD))
    with open(INDICE, "w", encoding="utf-8", newline="\n") as f:
        f.write(cabecera + json.dumps(dict(sorted(mapa.items())), ensure_ascii=False, indent=1) + ";\n")

    total = sum(os.path.getsize(os.path.join(CARPETA, n)) for n in usados)
    print("borrados %d que sobraban; audio/voz ocupa %.1f MB" % (len(sobran), total / 1e6))


if __name__ == "__main__":
    main()
