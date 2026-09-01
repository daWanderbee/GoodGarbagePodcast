# Builds numbered contact sheets from a folder of images, so a batch can be eyeballed
# in a few reads instead of one read per file. Uses System.Drawing — no extra tooling.
param(
  [string]$InDir,
  [string]$OutDir,
  [int]$Cols = 3,
  [int]$Rows = 2,
  [int]$CellW = 640,
  [int]$CellH = 360,
  [string]$Prefix = "sheet"
)

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$files = Get-ChildItem $InDir -Filter *.jpg | Sort-Object Name
$perSheet = $Cols * $Rows
$sheetNo = 0
$index = 0

for ($start = 0; $start -lt $files.Count; $start += $perSheet) {
  $sheetNo++
  $batch = $files[$start..([Math]::Min($start + $perSheet - 1, $files.Count - 1))]

  $bmp = New-Object System.Drawing.Bitmap(($Cols * $CellW), ($Rows * ($CellH + 28)))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Black)
  $font = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
  $brush = [System.Drawing.Brushes]::White

  $i = 0
  foreach ($f in $batch) {
    $index++
    $col = $i % $Cols
    $row = [Math]::Floor($i / $Cols)
    $x = $col * $CellW
    $y = $row * ($CellH + 28)

    $g.DrawString("[$index] $($f.BaseName)", $font, $brush, ($x + 6), ($y + 3))

    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $g.DrawImage($img, $x, ($y + 26), $CellW, $CellH)
    $img.Dispose()
    $i++
  }

  $g.Dispose()
  $out = Join-Path $OutDir ("{0}-{1:d2}.jpg" -f $Prefix, $sheetNo)
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
  Write-Output "wrote $out"
}
Write-Output "total images: $($files.Count)"
