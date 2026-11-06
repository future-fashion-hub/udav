import fs from 'node:fs';
import {mdiLightningBolt,mdiTrophy,mdiSnake} from '@mdi/js';
const icons={battles:mdiLightningBolt,ranking:mdiTrophy,profile:mdiSnake};
for(const file of ['public/review.html','.frontend-design/udav/2026-11-05-udav.html']){let html=fs.readFileSync(file,'utf8');html=html.replace(/(<b[^>]*data-fd-id="text-(battles|ranking|profile)"[^>]*>)(?:<img[^>]*>)?/g,(_,prefix,key)=>{const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#15110e" d="${icons[key]}"/></svg>`;return prefix+`<img alt="" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/>`});fs.writeFileSync(file,html)}
