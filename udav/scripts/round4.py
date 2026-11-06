from pathlib import Path
from PIL import Image
r=Path.cwd();im=Image.open(r/'public/assets/udav/reference.png');im.crop((28,747,177,895)).save(r/'public/assets/udav/crown.png');im.crop((28,747,177,895)).save(r/'native/assets/udav/crown.png')
p=r/'src/Prototype.tsx';s=p.read_text(encoding='utf-8');s='import { Pencil1Icon } from "@radix-ui/react-icons";\n'+s;s=s.replace('<b>{i + 1}</b>','<b className="rank-position">{i + 1}</b>').replace('<b>{u.points.toLocaleString("ru")}</b>','<b className="rank-points">{u.points.toLocaleString("ru")}</b>')
s=s.replace('<img src={a("avatar-me")} alt="Мой аватар" />','''<div className="profile-avatar-wrap"><img className="profile-avatar" src={a("avatar-me")} alt="Мой аватар"/><img className="profile-crown" src={a("crown")} alt=""/><button className="profile-edit" aria-label="Редактировать профиль" onClick={()=>setSheet('edit')}><Pencil1Icon width={22} height={22}/></button></div>''')
s=s.replace('''                    <button
                      className="outline"
                      onClick={() => setSheet("edit")}
                    >
                      Редактировать профиль
                    </button>''','')
s=s.replace('<h2>На витрине</h2>','<h2 className="profile-section-title">На витрине</h2>').replace('<h2>История батлов</h2>','<h2 className="profile-section-title">История батлов</h2>').replace('''                      Пока тихо. Самое время пошуметь!
                      <button''','''                      <p className="empty-copy">Пока тихо. Самое время пошуметь!</p>
                      <button''')
p.write_text(s,encoding='utf-8')
