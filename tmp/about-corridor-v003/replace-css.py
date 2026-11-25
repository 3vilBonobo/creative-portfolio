from pathlib import Path
p=Path('src/style.css'); text=p.read_text(encoding='utf-8')
start=text.index('/* Level 03 — quiet, inhabited concrete floor. */')
end=text.index('/* Level 02 — native horizontal project gallery. */',start)
text=text[:start]+Path('tmp/about-corridor-v003/about.css').read_text(encoding='utf-8')+text[end:]
# Remove About from the later shared navigation-gutter overrides only.
text=text.replace('  .about,\n  .projects {','  .projects {').replace('  .about__layout,\n  .projects__header,','  .projects__header,')
start=text.index('@media (min-width: 1101px) and (max-width: 1300px) {\n  .about__layout')
end=text.index('@media (min-width: 761px) and (max-width: 1100px)',start)
text=text[:start]+text[end:]
p.write_text(text,encoding='utf-8',newline='\n')

