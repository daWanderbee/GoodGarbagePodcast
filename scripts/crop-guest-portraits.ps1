# Crops the guest's face out of each episode thumbnail into a square portrait.
#
# The show has used four thumbnail templates and the host (Ved Krishna) is not always on
# the same side, so the crop box comes from a hand-verified map rather than one rule â€” a
# wrong guess would put the host's face under a guest's name.
#   B = teal card, guest portrait in a circle on the LEFT, name label beneath
#   C = studio cut-out, guest LEFT, Ved RIGHT
#   D = teal wedge split, Ved LEFT, guest RIGHT, both names in a strip
#   A = raw video-call grid, layout varies episode to episode â€” deliberately excluded
#
# Keyed by publish date, not video id: YouTube ids mix capital I and lowercase l, which is
# unreadable off a contact sheet.
param([string]$InDir, [string]$OutDir, [int]$Size = 400)

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# x, y, w, h on the 1280x720 thumbnail
$BOX = @{
  B = @(60, 283, 315, 315)
  C = @(35, 105, 300, 300)
  D = @(860, 175, 420, 420)
  D2 = @(880, 65, 400, 400)    # same layout, guest sits higher in frame
}

$TEMPLATE = @{}
"2024-10-24 2025-01-23 2025-01-24 2025-01-25 2025-01-26 2025-01-27 2025-01-31 2025-02-17 2025-03-02 2025-03-15 2025-04-10 2025-05-05 2025-05-31 2025-09-12 2025-12-27".Split(" ") | ForEach-Object { $TEMPLATE[$_] = "B" }
"2025-06-06 2025-06-23 2025-07-04 2025-07-17 2025-07-31 2025-08-14 2025-08-28 2025-10-03 2025-10-09 2025-10-24".Split(" ") | ForEach-Object { $TEMPLATE[$_] = "C" }
"2025-11-20 2026-02-03 2026-02-14 2026-02-26 2026-04-30".Split(" ") | ForEach-Object { $TEMPLATE[$_] = "D" }
$TEMPLATE["2026-04-16"] = "D2"

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

$made = 0
foreach ($f in Get-ChildItem $InDir -Filter *.jpg) {
  $parts = $f.BaseName -split "_", 2
  $date = $parts[0]
  $id = $parts[1]
  if (-not $TEMPLATE.ContainsKey($date)) { continue }

  $b = $BOX[$TEMPLATE[$date]]
  $img = [System.Drawing.Image]::FromFile($f.FullName)

  $out = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $src = New-Object System.Drawing.Rectangle($b[0], $b[1], $b[2], $b[3])
  $dst = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
  $g.DrawImage($img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $img.Dispose()

  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82)
  $out.Save((Join-Path $OutDir "$id.jpg"), $encoder, $params)
  $out.Dispose()
  $made++
}
Write-Output "cropped $made portraits into $OutDir"



