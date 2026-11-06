from PIL import Image
from pathlib import Path
import shutil
r=Path.cwd();src=Image.open('C:/Users/Данила/.codex/generated_images/01a1ad33-4cfc-7b33-afce-4fb71dcdd317/exec-b5e14787-9706-482e-8ce2-bce6f34ade54.png');w,h=src.size
for name,x,y in [('cup-gold',0,0),('cup-silver',1,0),('cup-bronze',0,1),('nav-snake-profile',1,1)]:
 src.crop((x*w//2+3,y*h//2+3,(x+1)*w//2-3,(y+1)*h//2-3)).save(r/f'public/assets/udav/{name}.png')
shutil.copy(r/'public/assets/udav/cup-gold.png',r/'public/assets/udav/nav-cup.png')
for p in (r/'public/assets/udav').glob('*.png'):shutil.copy(p,r/'native/assets/udav'/p.name)
