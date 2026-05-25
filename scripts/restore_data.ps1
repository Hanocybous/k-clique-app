<#
PowerShell helper: restore_data.ps1

Moves files back from `backend/local_data/` to `backend/` if placeholder files exist.

Run from project root (PowerShell):
  .\scripts\restore_data.ps1
#>

Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDir = Resolve-Path (Join-Path $scriptRoot "..\backend")
$localDataDir = Join-Path $backendDir "local_data"

If (-not (Test-Path $localDataDir)) {
    Write-Warning "No local_data directory found. Nothing to restore."
    return
}

Get-ChildItem -Path $localDataDir -File | ForEach-Object {
    $src = $_.FullName
    $dest = Join-Path $backendDir $_.Name
    try {
        # If there is a placeholder at dest, remove it first
        if (Test-Path $dest) { Remove-Item -Path $dest -Force }
        Move-Item -Path $src -Destination $dest -Force
        Write-Host "Restored: $($_.Name) -> backend/"
    }
    catch {
        Write-Warning "Failed to restore $($_.Name): $_"
    }
}

Write-Host "Restore complete."

