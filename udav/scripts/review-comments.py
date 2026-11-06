from pathlib import Path
import base64
p=Path('scripts/make-review.py');s=p.read_text(encoding='utf-8');s=s.replace("template=template.replace('</head>'", "template=template.replace('</head>'")
# The source-proportional review uses the current icons and local embedded display face.
p=Path('public/review.html');s=p.read_text(encoding='utf-8')
for label,icon in [('Батлы','nav-battle'),('Рейтинг','nav-cup'),('Профиль','nav-snake-profile')]:
 data=base64.b64encode(Path(f'public/assets/udav/{icon}.png').read_bytes()).decode()
 s=s.replace(f'>{label}</b>',f'><img alt="" src="data:image/png;base64,{data}"/>{label}</b>')
font=base64.b64encode(Path('node_modules/@fontsource/dela-gothic-one/files/dela-gothic-one-cyrillic-400-normal.woff2').read_bytes()).decode()
css='''@font-face{font-family:Dela;src:url(data:font/woff2;base64,'''+font+''') format('woff2')}[data-fd-id="row-sasha"]{clip-path:inset(0 14% 0 0)}.review-phone nav b{display:flex;align-items:center;gap:4px;font-family:Dela,Arial;font-size:10px}.review-phone nav b img{height:24px;width:24px;object-fit:contain;mix-blend-mode:multiply}'''
s=s.replace('</head>','<style>'+css+'</style></head>');p.write_text(s,encoding='utf-8');Path('.frontend-design/udav/2026-11-05-udav.html').write_text(s,encoding='utf-8')
