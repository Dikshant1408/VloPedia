Add-Type -AssemblyName System.IO.Compression.FileSystem
$cwd = (Get-Location).Path
$outPath = Join-Path $cwd "out"
$zipPath = Join-Path $cwd "vlopedia-deploy.zip"
$backupZip = Join-Path $cwd "vlopedia-deploy-prev.zip"

Write-Host "Packaging $outPath into $zipPath..."
if (Test-Path $zipPath) {
    Copy-Item $zipPath $backupZip -Force
    Remove-Item $zipPath -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($outPath, $zipPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
$item = Get-Item $zipPath
Write-Host "Success! Created $($item.Name) with size $($item.Length) bytes ($([math]::Round($item.Length / 1MB, 2)) MB)"
