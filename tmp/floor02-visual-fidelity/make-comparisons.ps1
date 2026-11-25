Add-Type -AssemblyName System.Drawing
$dir = Join-Path (Get-Location) 'tmp/floor02-visual-fidelity'
function New-Comparison($files, $labels, $widths, $output) {
  $images = @($files | ForEach-Object { [System.Drawing.Image]::FromFile((Join-Path $dir $_)) })
  $height = 0
  $totalWidth = 0
  for ($i=0; $i -lt $images.Count; $i++) { $height=[Math]::Max($height,[int]($images[$i].Height*$widths[$i]/$images[$i].Width)); $totalWidth += $widths[$i]+12 }
  $canvas = New-Object System.Drawing.Bitmap ($totalWidth+12),($height+56)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear([System.Drawing.Color]::FromArgb(12,15,19))
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $font = New-Object System.Drawing.Font 'Segoe UI',13
  $x=12
  for ($i=0; $i -lt $images.Count; $i++) {
    $graphics.DrawString($labels[$i],$font,[System.Drawing.Brushes]::White,$x,8)
    $graphics.DrawImage($images[$i],$x,40,$widths[$i],[int]($images[$i].Height*$widths[$i]/$images[$i].Width))
    $x += $widths[$i]+12
    $images[$i].Dispose()
  }
  $canvas.Save((Join-Path $dir $output),[System.Drawing.Imaging.ImageFormat]::Jpeg)
  $font.Dispose(); $graphics.Dispose(); $canvas.Dispose()
}
New-Comparison @('before-desktop-aligned.jpg','after-desktop.jpg') @('Before','After — ISS featured') @(700,700) 'before-after.jpg'
New-Comparison @('after-desktop.jpg','after-tablet.jpg','after-mobile.jpg') @('Desktop · 1440','Tablet · 768','Mobile · 390') @(720,384,195) 'responsive-comparison.jpg'
