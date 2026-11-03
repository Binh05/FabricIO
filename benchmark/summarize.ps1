# Aggregate per-run JSON files into summary.csv (median run by p95 for each scenario).
param([string]$Label = "b0")

$dir = Join-Path $PSScriptRoot "results\$Label"
$files = Get-ChildItem $dir -Filter "*-run*.json" | Where-Object { $_.Name -notlike "*-full.json" }
if (-not $files) { Write-Warning "No result files in $dir"; exit 1 }

$rows = $files | ForEach-Object { Get-Content $_.FullName -Raw | ConvertFrom-Json }

$summary = $rows | Group-Object scenario | ForEach-Object {
  $g = @($_.Group | Sort-Object p95)
  $mid = $g[[int][math]::Floor(($g.Count - 1) / 2)]
  [pscustomobject]@{
    label       = $Label
    scenario    = $_.Name
    runs        = $g.Count
    vus         = $mid.vus
    p50_ms      = $mid.p50
    p95_ms      = $mid.p95
    p99_ms      = $mid.p99
    req_per_s   = $mid.rps
    failed_rate = $mid.failed_rate
    p95_min_ms  = ($g | Measure-Object p95 -Minimum).Minimum
    p95_max_ms  = ($g | Measure-Object p95 -Maximum).Maximum
  }
}

$summary | Format-Table -AutoSize
$csv = Join-Path $dir "summary.csv"
$summary | Export-Csv $csv -NoTypeInformation -Encoding utf8
Write-Host "Saved: $csv"
