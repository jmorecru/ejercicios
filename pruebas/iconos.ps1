# Genera los iconos de la app (una mancuerna sobre fondo azul) con System.Drawing.
#
#   powershell -File pruebas\iconos.ps1
#
# Va sin acentos a proposito: PowerShell 5.1 lee los .ps1 sin BOM como ANSI.

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$raiz = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $raiz "icons"
New-Item -ItemType Directory -Force $dir | Out-Null

function Redondo($g, $brocha, $x, $y, $w, $h, $r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = 2 * $r
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    $g.FillPath($brocha, $p)
    $p.Dispose()
}

# escala: tamano del dibujo respecto al icono (el maskable necesita margen)
function Icono($tam, $escala, $nombre, $esquinas) {
    $bmp = New-Object System.Drawing.Bitmap $tam, $tam
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    $azul = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 58, 95))
    $blanco = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $turq = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(83, 196, 204))
    if ($esquinas) { Redondo $g $azul 0 0 $tam $tam ($tam * 0.22) } else { $g.FillRectangle($azul, 0, 0, $tam, $tam) }

    $u = $tam * $escala / 100.0
    $c = $tam / 2.0
    # barra
    Redondo $g $turq ($c - 30 * $u) ($c - 4 * $u) (60 * $u) (8 * $u) (2 * $u)
    # discos grandes
    Redondo $g $blanco ($c - 34 * $u) ($c - 24 * $u) (12 * $u) (48 * $u) (4 * $u)
    Redondo $g $blanco ($c + 22 * $u) ($c - 24 * $u) (12 * $u) (48 * $u) (4 * $u)
    # discos pequenos
    Redondo $g $blanco ($c - 44 * $u) ($c - 15 * $u) (9 * $u) (30 * $u) (3 * $u)
    Redondo $g $blanco ($c + 35 * $u) ($c - 15 * $u) (9 * $u) (30 * $u) (3 * $u)

    $g.Dispose()
    $bmp.Save((Join-Path $dir $nombre), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Icono 192 1.0 "icon-192.png" $false
Icono 512 1.0 "icon-512.png" $false
Icono 512 0.75 "icon-512-maskable.png" $false
Icono 180 1.0 "apple-touch-icon.png" $false
"iconos generados en $dir"
