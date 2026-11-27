Add-Type -AssemblyName System.Drawing
$reviewRoot = $PSScriptRoot
$labelFont = [System.Drawing.Font]::new('Segoe UI', 14)
$captionFont = [System.Drawing.Font]::new('Segoe UI', 10)
$white = [System.Drawing.Brushes]::White
$muted = [System.Drawing.Brushes]::LightGray
function New-Sheet($width, $height) {
  $bitmap = [System.Drawing.Bitmap]::new($width,$height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::FromArgb(13,20,19))
  return @($bitmap,$graphics)
}
function Draw-Shot($graphics,$file,$x,$y,$width,$height,$sourceRect=$null) {
  $img=[System.Drawing.Image]::FromFile((Join-Path $reviewRoot $file))
  if ($null -eq $sourceRect) { $sourceRect=[System.Drawing.Rectangle]::new(0,0,$img.Width,$img.Height) }
  $graphics.DrawImage($img,[System.Drawing.Rectangle]::new($x,$y,$width,$height),$sourceRect,[System.Drawing.GraphicsUnit]::Pixel)
  $img.Dispose()
}
$sheet,$g=New-Sheet 1280 390
$g.DrawString('Laptop screen / before, idle, hover and playback', $labelFont,$white,18,12)
$files=@('before-desktop-day.jpg','after-desktop-day-idle.jpg','after-desktop-laptop-hovered.jpg','after-desktop-laptop-playing-day.jpg')
$labels=@('Before','After / idle','After / actual hover','After / playing')
for($i=0;$i -lt 4;$i++) {
  $g.DrawString($labels[$i],$captionFont,$muted,18+$i*316,48)
  Draw-Shot $g $files[$i] (18+$i*316) 75 300 280 ([System.Drawing.Rectangle]::new(865,530,150,140))
}
$g.DrawString('Cropped browser screenshots enlarged 2x. Fine detail is limited by the original ~40px display.',$captionFont,$muted,18,365)
$sheet.Save((Join-Path $reviewRoot 'comparison-laptop.png')); $g.Dispose(); $sheet.Dispose()
$sheet,$g=New-Sheet 1460 1015
$g.DrawString('Floor 03 / before and after persistent controls', $labelFont,$white,18,12)
$g.DrawString('Before / desktop',$captionFont,$muted,18,48)
$g.DrawString('After / desktop, music continuing',$captionFont,$muted,750,48)
Draw-Shot $g 'before-desktop-about.jpg' 18 75 700 438
Draw-Shot $g 'after-desktop-about-playing.jpg' 750 75 700 438
$g.DrawString('Before / mobile',$captionFont,$muted,18,530)
$g.DrawString('After / mobile, one-tap mute',$captionFont,$muted,400,530)
Draw-Shot $g 'before-mobile-about.jpg' 18 556 200 433
Draw-Shot $g 'after-mobile-about.jpg' 400 556 200 433
$g.DrawString('Native browser screenshots. Mobile views use a simulated 390 x 844 viewport.',$captionFont,$muted,650,600)
$g.DrawString('Scroll framing can differ between captures; no pixel-identical comparison is claimed.',$captionFont,$muted,650,625)
$sheet.Save((Join-Path $reviewRoot 'comparison-controls.png')); $g.Dispose(); $sheet.Dispose()
$sheet,$g=New-Sheet 1400 925
$g.DrawString('Expanded radio / new desktop and mobile interface', $labelFont,$white,18,12)
$g.DrawString('Before: no radio player existed. After: shared native playback and all five stations.',$captionFont,$muted,18,45)
Draw-Shot $g 'after-desktop-player-playing.jpg' 18 80 1008 630
Draw-Shot $g 'after-mobile-player.jpg' 1045 80 340 736
$g.DrawString('Desktop 1440 x 900 / mobile 390 x 844. On mobile, the station directory follows playback.',$captionFont,$muted,18,850)
$sheet.Save((Join-Path $reviewRoot 'comparison-player.png')); $g.Dispose(); $sheet.Dispose()
$labelFont.Dispose(); $captionFont.Dispose()
