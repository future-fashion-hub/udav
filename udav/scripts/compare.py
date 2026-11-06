from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
r=Path.cwd();source=Image.open(r/'public/assets/udav/reference.png').convert('RGB');screen=Image.open(r/'qa/home.png').convert('RGB');left=source.resize((393,852));out=Image.new('RGB',(810,890),'#eeeeee');out.paste(left,(0,30));out.paste(screen,(417,30));d=ImageDraw.Draw(out);d.text((10,8),'Reference (normalized 393x852)',fill='black');d.text((427,8),'Implementation (includes OS safe area)',fill='black');out.save(r/'qa/comparison.png')
