$ErrorActionPreference = 'Stop'
$headers = @{ 'User-Agent' = 'IrenePortfolioAquascape/1.0' }
$outputRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\external\polyhaven'
$assetIds = @('boulder_01', 'coast_land_rocks_03', 'fern_02', 'calathea_orbifolia_01', 'moss_01', 'dead_tree_trunk_02', 'bark_debris_01')

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
foreach ($assetId in $assetIds) {
  $manifest = Invoke-RestMethod -Headers $headers -Uri "https://api.polyhaven.com/files/$assetId"
  $package = $manifest.gltf.'1k'.gltf
  if (-not $package.url) { throw "No 1K glTF package found for $assetId" }
  $assetDir = Join-Path $outputRoot $assetId
  New-Item -ItemType Directory -Force -Path $assetDir | Out-Null
  Invoke-WebRequest -Headers $headers -Uri $package.url -OutFile (Join-Path $assetDir "$assetId.gltf")
  foreach ($dependency in $package.include.PSObject.Properties) {
    $relativePath = $dependency.Name -replace '/', '\'
    $target = Join-Path $assetDir $relativePath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
    Invoke-WebRequest -Headers $headers -Uri $dependency.Value.url -OutFile $target
  }
}

@'
# Imported aquascape assets

All assets in this folder were downloaded from [Poly Haven](https://polyhaven.com/) through its official API and are released under the CC0 licence.

- `boulder_01` — realistic scanned boulder
- `fern_02` — realistic fern foliage
- `moss_01` — realistic moss ground cover
- `dead_tree_trunk_02` — scanned weathered deadwood
- `coast_land_rocks_03` — scanned layered rock formation
- `calathea_orbifolia_01` — broad-leaf tropical foliage
- `bark_debris_01` — natural bark and root detail

Resolution: 1K glTF packages, downloaded for use in the portfolio aquarium. The production GLB is an optimized derivative assembled in Blender.
'@ | Set-Content -LiteralPath (Join-Path $outputRoot 'README.md')
