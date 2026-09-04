# Crops the guest's face out of each episode thumbnail into a square portrait.
#
#   powershell -File scripts\crop-portraits.ps1 -Map .crops.csv -InDir .thumbs -OutDir .portraits
#
# The show has used six thumbnail templates over four years and the host (Ved Krishna) is
# not always on the same side, so the crop box comes from a hand-classified map rather than
# one rule. Getting this wrong files the host's face under a guest's name, so every crop is
# checked against a contact sheet afterwards and anything ambiguous is dropped rather than
# guessed at.
#
#   L  teal two-shot, guest LEFT, Ved right          (the 2022-2024 house style)
#   L3 same card with THREE faces, so the guest sits hard against the left edge
#   LL same as L, for the guests who sit low in their webcam frame
#   LX same as L, for the guests sitting hard against the left edge
#   R  teal two-shot, Ved LEFT, guest right          (same card, sides swapped)
#   RL same as R, guest low in frame
#   GR raw video-call grid, Ved left, guest RIGHT
#   B  cream speech-bubble card, guest in a circle on the LEFT, name label beneath
#   C  studio cut-out, guest LEFT full-body, Ved right in red
#   D  teal wedge split, Ved LEFT, guest RIGHT, both names in a strip
param(
  [string]$Map = ".crops.csv",
  [string]$InDir = ".thumbs",
  [string]$OutDir = ".portraits",
  [int]$Size = 400
)

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# x, y, w, h on the 1280x720 thumbnail
$BOX = @{
  L  = @(100, 120, 340, 340)
  L3 = @(0, 150, 340, 340)
  LL = @(100, 250, 340, 340)
  LX = @(15, 150, 340, 340)
  R  = @(850, 140, 330, 330)
  RL = @(850, 250, 330, 330)
  GR = @(800, 215, 340, 340)
  B  = @(60, 283, 315, 315)
  C  = @(35, 105, 300, 300)
  D  = @(860, 175, 420, 420)
}

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88)

$made = 0
$skipped = 0
foreach ($row in Import-Csv $Map) {
  $src = Join-Path $InDir $row.file
  if (-not (Test-Path $src)) { $skipped++; continue }
  if (-not $BOX.ContainsKey($row.template)) { $skipped++; continue }

  $b = $BOX[$row.template]
  $img = [System.Drawing.Image]::FromFile($src)

  # Boxes are written against 1280x720; a few thumbnails come back as 480x360 hqdefault.
  $sx = $img.Width / 1280.0
  $sy = $img.Height / 720.0

  $out = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle(
    [int]($b[0] * $sx), [int]($b[1] * $sy), [int]($b[2] * $sx), [int]($b[3] * $sy))
  $dstRect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
  $g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  # Keep the source filename so date and video id survive into the verification sheet.
  $out.Save((Join-Path $OutDir $row.file), $encoder, $params)
  $out.Dispose()
  $img.Dispose()
  $made++
}

Write-Output "cropped $made, skipped $skipped -> $OutDir"
