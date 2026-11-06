from PIL import Image
from pathlib import Path
r=Path.cwd();src=Image.open('C:/Users/Данила/.codex/generated_images/01a1ad33-4cfc-7b33-afce-4fb71dcdd317/exec-96c3d0f5-7435-4700-b08c-462883667aa9.png');w,h=src.size
for i in range(6):
 x=i%3;y=i//3;src.crop((x*w//3,y*h//2,(x+1)*w//3,(y+1)*h//2)).save(r/f'public/assets/udav/sticker-{i}.png')
