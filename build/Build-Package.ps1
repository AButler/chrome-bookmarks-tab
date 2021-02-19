$ErrorActionPreference = 'Stop'

$solutionDirectory = Join-Path $PSScriptRoot '..\'
$srcDirectory = Join-Path $solutionDirectory 'src'
$packageFilename = Join-Path $solutionDirectory 'packages-build\new-tab.zip'

Write-Host 'Building package...'
if ( Test-Path $packageFilename ) {
  Remove-Item $packageFilename
}

Compress-Archive -Path "$srcDirectory\*" -DestinationPath $packageFilename
Write-Host 'Done!'