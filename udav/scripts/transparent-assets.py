from pathlib import Path
from PIL import Image
import shutil
r=Path.cwd();base=Path('C:/Users/Данила/.codex/generated_images/01a1ad33-4cfc-7b33-afce-4fb71dcdd317')
for fn,cols,rows,names in [('exec-a1c09428-7d37-41de-8305-529f9d66fcff.png',3,2,[f'sticker-{i}' for i in range(6)]),('exec-4f7d33dc-3ae0-4326-8fae-98f4f2a204cd.png',2,2,['cup-gold','cup-silver','cup-bronze','nav-snake-profile'])]:
 im=Image.open(base/fn);w,h=im.size
 for i,name in enumerate(names):
  x=i%cols;y=i//cols;tile=im.crop((x*w//cols,y*h//rows,(x+1)*w//cols,(y+1)*h//rows));tile.save(r/f'public/assets/udav/{name}.png');print(name,tile.getchannel('A').getextrema())
shutil.copy(r/'public/assets/udav/cup-gold.png',r/'public/assets/udav/nav-cup.png')
for p in (r/'public/assets/udav').glob('*.png'):shutil.copy(p,r/'native/assets/udav'/p.name)
