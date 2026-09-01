# Downloads the @GoodGarbage episode thumbnails listed in src/lib/youtube-episodes.ts.
param([string]$OutDir, [int]$Every = 1)

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$src = Get-Content "src\lib\youtube-episodes.ts" -Raw
$matches = [regex]::Matches($src, '"videoId":"([^"]+)","titles":\[("(?:[^"\\]|\\.)*")[^\]]*\],"thumbnail":"([^"]+)","date":"([^"]*)"')

$rows = foreach ($m in $matches) {
  [PSCustomObject]@{
    Id    = $m.Groups[1].Value
    Title = $m.Groups[2].Value.Trim('"')
    Url   = $m.Groups[3].Value
    Date  = $m.Groups[4].Value
  }
}
$rows = $rows | Sort-Object Date

$i = 0
$done = 0
foreach ($r in $rows) {
  if (($i % $Every) -eq 0) {
    $dest = Join-Path $OutDir "$($r.Date)_$($r.Id).jpg"
    if (-not (Test-Path $dest)) {
      try {
        Invoke-WebRequest -Uri $r.Url -OutFile $dest -TimeoutSec 30 -ErrorAction Stop
        $done++
      } catch {
        Write-Output "FAILED $($r.Id) $($r.Date)"
      }
    } else { $done++ }
  }
  $i++
}
Write-Output "downloaded/present: $done of $($rows.Count) (every $Every)"
