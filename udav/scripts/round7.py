from pathlib import Path
p=Path('src/Prototype.tsx');s=p.read_text(encoding='utf-8').replace('type Match = { won: boolean; time: string };','type Match = { won: boolean; time: string; opponent?:string };').replace('[matches, setMatches] = useState<Match[]>([])','[matches, setMatches] = useState<Match[]>([{won:true,time:"Вчера, 21:42",opponent:"Саша"},{won:false,time:"Вчера, 20:15",opponent:"Аня Анаконда"}])')
s=s.replace('className="image-button challenge"','className="home-challenge"').replace('<img src={a("battle-button")} alt="Вызвать на батл" />','<span>Вызвать на батл</span><Icon path={mdiLightningBolt} size={1.4} aria-hidden="true"/>')
s=s.replace('ДЕМО-БАТЛ С САШЕЙ','БАТЛ С САШЕЙ').replace('Начать демо-батл','Начать батл').replace('−15 очков. Зато размялся.','Зато размялся.').replace('className="battle-snake"\n                    src={a("snake")}','className="battle-snake"\n                    src={a("sticker-1")}')
s=s.replace('''                        <strong>
                          Саша
                          <small>''','''                        <strong>
                          {m.opponent||"Саша"}
                          <small>''')
s=s.replace('''                  <span>Поражения</span>
                </div>
              </div>''','''                  <span>Поражения</span>
                </div><div><b>1 480</b><span>Рейтинг</span></div>
              </div>''');p.write_text(s,encoding='utf-8')
p=Path('native/App.tsx');s=p.read_text(encoding='utf-8').replace('type Match = { won: boolean; time: string };','type Match = { won: boolean; time: string; opponent?:string };').replace('[history, setHistory] = useState<Match[]>([])','[history, setHistory] = useState<Match[]>([{won:true,time:"Вчера, 21:42",opponent:"Саша"},{won:false,time:"Вчера, 20:15",opponent:"Аня Анаконда"}])').replace('ДЕМО-БАТЛ С САШЕЙ','БАТЛ С САШЕЙ').replace('Начать демо-батл','Начать батл').replace('−15 очков. Зато размялся.','Зато размялся.').replace('source={images.snake}','source={stickers[1]}').replace('aspectRatio: 852 / 616','aspectRatio: 1,resizeMode:"contain"')
s=s.replace('Саша · {h.time}','{h.opponent||"Саша"} · {h.time}').replace('<Text style={s.bold}>17 поражений</Text>','<Text style={s.bold}>17 поражений</Text><Text style={s.bold}>1 480 рейтинг</Text>')
start=s.index('          {hot("Вызвать на батл"');end=s.index('          {hot("Пригласить друга"',start)
s=s[:start]+'''          <Pressable accessibilityRole="button" onPress={()=>setSheet('challenge')} style={[s.button,{position:'absolute',left:canvasW*24/852,top:canvasH*1449/1846,width:canvasW*805/852,height:canvasH*165/1846,marginVertical:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:0}]}><Text style={[s.buttonText,{fontSize:17}]}>Вызвать на батл</Text><MaterialCommunityIcons name="lightning-bolt" size={32} color="#15110e"/></Pressable>
'''+s[end:];p.write_text(s,encoding='utf-8')
