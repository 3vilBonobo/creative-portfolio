from pathlib import Path
p=Path('src/style.css')
text=p.read_text(encoding='utf-8')
start=text.index('/* Level 03 — corridor v003.')
end=text.index('/* Level 02 — native horizontal project gallery. */',start)
p.write_text(text[:start]+Path('tmp/about-corridor-v003/personal-about.css').read_text(encoding='utf-8')+text[end:],encoding='utf-8',newline='\n')
