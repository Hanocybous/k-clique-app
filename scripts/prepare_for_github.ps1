<#
PowerShell helper: prepare_for_github.ps1

This script moves large files from `backend/` into `backend/local_data/` and leaves a small placeholder
file with the same name so code referencing the file doesn't fail. Files moved are ignored via .gitignore.

Run from project root (PowerShell):
  .\scripts\prepare_for_github.ps1
#>

Set-StrictMode -Version Latest

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDir = Resolve-Path (Join-Path $scriptRoot "..\backend")
$localDataDir = Join-Path $backendDir "local_data"

If (-not (Test-Path $localDataDir)) {
    New-Item -Path $localDataDir -ItemType Directory | Out-Null
}

# Threshold in bytes: files larger than this will be moved
$threshold = 200KB

Write-Host "Scanning files in $backendDir for items larger than $threshold bytes..."

Get-ChildItem -Path $backendDir -File | ForEach-Object {
    $file = $_
    # Skip this helper scripts or files we definitely want to keep
    if ($file.Name -in @('prepare_for_github.ps1','restore_data.ps1')) { return }

    if ($file.Length -gt $threshold) {
        $dest = Join-Path $localDataDir $file.Name
        try {
            Move-Item -Path $file.FullName -Destination $dest -Force
            $msg = "This file was moved to 'backend/local_data/' to keep the repository small.`nOriginal size: $($file.Length) bytes.`nTo restore, run .\scripts\restore_data.ps1"
            $msg | Out-File -FilePath $file.FullName -Encoding utf8
            Write-Host "Moved $($file.Name) -> backend/local_data/ and left placeholder."
        }
        catch {
            Write-Warning "Failed to move $($file.Name): $_"
        }
    }
}

Write-Host "Done. Files moved to backend/local_data/ are now ignored by .gitignore. Review changes before committing."

