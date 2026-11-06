from pathlib import Path
p=Path('src/Prototype.tsx');s=p.read_text(encoding='utf-8').replace('import { Pencil1Icon }','import { Pencil1Icon, LightningBoltIcon }');s=s.replace('<img src={a(icon)} alt="" />','{id==="home"?<LightningBoltIcon aria-hidden="true"/>:<img src={a(icon)} alt=""/>}');p.write_text(s,encoding='utf-8')
p=Path('native/App.tsx');s=p.read_text(encoding='utf-8').replace('borderWidth: 1.5','borderWidth: 3');start=s.index('accessibilityLabel="Редактировать профиль"');end=s.index('                  >',start);piece=s[start:end].replace('shadowOpacity: 1','shadowOpacity: 0').replace('elevation: 5','elevation: 0');s=s[:start]+piece+s[end:];s=s.replace('<Text style={s.body}>Пока тихо. Самое время пошуметь!</Text>','<Text style={[s.body,{textAlign:"center"}]}>Пока тихо. Самое время пошуметь!</Text>')
s=s.replace('source={navImages[i]}','source={navImages[i]}\n                tintColor="#15110e"')
# Replace only the battle raster, whose source includes a solid lime backing.
start=s.index('              <Image\n                source={navImages[i]}');end=s.index('              />',start)+len('              />');old=s[start:end];s=s[:start]+'''              {i===0?<MaterialCommunityIcons name="lightning-bolt" size={27} color="#15110e"/>:('''+old+''')}
'''+s[end:]
s=s.replace('padding: 10,\n                          borderRadius: 20,','padding: 10,\n                          borderWidth:3,borderColor:"#15110e",\n                          borderRadius: 20,');p.write_text(s,encoding='utf-8')
