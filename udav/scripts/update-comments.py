from pathlib import Path
p=Path('src/Prototype.tsx');s=p.read_text(encoding='utf-8');s='import "@fontsource/dela-gothic-one/cyrillic-400.css";\nimport "@fontsource/dela-gothic-one/latin-400.css";\n'+s
s=s.replace('type Match =', '''const achievements=[
 {name:'Самый быстрый трясун дикого запада',desc:'Победи за 5 секунд',art:'sticker-0'},
 {name:'Твой удав в шоке',desc:'Отыграйся с отставания в 50%',art:'sticker-1'},
 {name:'Вялый удав',desc:'Проиграй, не заполнив половину шкалы',art:'sticker-2'},
 {name:'Скрестить шпаги',desc:'Сыграй первый дружеский батл',art:'sticker-3'},
 {name:'Душитель рекордов',desc:'Одержи 10 побед',art:'sticker-4'},
 {name:'Король колбасни',desc:'Победи 3 раза подряд',art:'sticker-5'},
];
function Stickers({ids}:{ids:number[]}){return <div className="sticker-showcase">{ids.map(i=><div className="showcase-sticker" key={i}><img src={a(achievements[i].art)} alt=""/><b>{achievements[i].name}</b></div>)}</div>}
type Match =''')
s=s.replace('[pins, setPins] = useState([0])','[pins, setPins] = useState([0, 1, 3])')
s=s.replace('const [selectedPlayer,','const [pinNotice,setPinNotice]=useState("");\n  const [selectedPlayer,')
s=s.replace('Кто тут\n                    <br />\n                    главный удав?','Кто главный трясун?')
s=s.replace('<b>{i + 1}</b>','{i<3?<img className="rank-cup" src={a(["cup-gold","cup-silver","cup-bronze"][i])} alt={`${i+1} место`}/>:<b>{i+1}</b>}')
start=s.index('                  <p>Демо-коллекция:');end=s.index('                  <h2>История батлов</h2>',start)
s=s[:start]+'''                  <Stickers ids={pins}/>
                  <button className="outline" onClick={()=>{setPinNotice('');setSheet('achievements')}}>Выбрать достижения · {pins.length}/3</button>
'''+s[end:]
s=s.replace('className={"udav-nav " + (tab === "home" ? "home-nav" : "")}','className="udav-nav"')
s=s.replace('["rank", "Рейтинг", "nav-trophy"]','["rank", "Рейтинг", "nav-cup"]').replace('["profile", "Профиль", "nav-profile"]','["profile", "Профиль", "nav-snake-profile"]')
s=s.replace('<BottomSheet\n        open=', '<BottomSheet\n        snap={sheet === "achievements" ? .88 : .82}\n        open=')
s=s.replace('sheet === "edit"\n            ?', 'sheet === "achievements" ? "Твоя коллекция" : sheet === "edit"\n            ?')
s=s.replace('<h2>Ну что, потрясёмся?</h2>','<h2>Ну что, вздёрнем?</h2>\n              <div className="opponent-stats"><div><b>42</b><span>Победы</span></div><div><b>17</b><span>Поражения</span></div></div>\n              <Stickers ids={[0,1,3]}/>')
s=s.replace('''              <p>
                Демо-соперник готов. Кто первым заполнит шкалу — тот победил.
              </p>''','')
needle='          {sheet === "invite" && ('
s=s.replace(needle,'''          {sheet === "achievements" && <><div className="achievement-counter">На витрине: {pins.length}/3</div><p className="selection-notice" role="status">{pinNotice}</p><div className="achievement-grid">{achievements.map((b,i)=><button key={b.art} aria-pressed={pins.includes(i)} onClick={()=>{if(pins.includes(i)){setPins(v=>v.filter(n=>n!==i));setPinNotice('')}else if(pins.length<3){setPins(v=>[...v,i]);setPinNotice('')}else setPinNotice('На витрине только 3 места. Сними один стикер.')}}><img src={a(b.art)} alt=""/><b>{b.name}</b><span>{b.desc}</span><small>{pins.includes(i)?'На витрине · убрать':'Выставить'}</small></button>)}</div><button className="primary" onClick={()=>setSheet('')}>Готово</button></>}
'''+needle)
p.write_text(s,encoding='utf-8')
