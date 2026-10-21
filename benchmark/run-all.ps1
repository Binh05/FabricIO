# Run all read-only benchmark scenarios N times and aggregate the results.
# Usage (from anywhere):  powershell -ExecutionPolicy Bypass -File benchmark\run-all.ps1 -Label b0
param(
  [string]$Label = "b0",
  [int]$Runs = 3,
  [string]$BaseUrl = "http://localhost:8080",
  [string]$GamesPath = "/api/v1/games",
  [string]$Token = "",
  [int]$Vus = 20,
  [string]$Warmup = "30s",
  [string]$Duration = "2m",
  [string[]]$Scenarios = @("games-list", "games-list-deep", "games-search", "game-detail"),
  [int]$PauseSeconds = 10
)

# Always run from the project root so relative result paths are correct
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$outDir = Join-Path $PSScriptRoot "results\$Label"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

foreach ($s in $Scenarios) {
  for ($i = 1; $i -le $Runs; $i++) {
    Write-Host "=== $s : run $i of $Runs ==="
    k6 run "benchmark/k6/$s.js" `
      -e "BASE_URL=$BaseUrl" -e "GAMES_PATH=$GamesPath" -e "TOKEN=$Token" `
      -e "VUS=$Vus" -e "WARMUP=$Warmup" -e "DURATION=$Duration" `
      -e "LABEL=$Label" -e "RUN=$i"
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "k6 exit code $LASTEXITCODE (error rate too high or script error) - this run may be invalid"
    }
    Start-Sleep -Seconds $PauseSeconds
  }
}

& (Join-Path $PSScriptRoot "summarize.ps1") -Label $Label
