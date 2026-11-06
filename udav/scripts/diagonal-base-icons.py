from pathlib import Path
p=Path('src/Prototype.tsx');s=p.read_text(encoding='utf-8').replace('import { Pencil1Icon, LightningBoltIcon }','import Icon from "@mdi/react";\nimport {mdiLightningBolt,mdiTrophy,mdiSnake} from "@mdi/js";\nimport { Pencil1Icon }');old='''{id === "home" ? (
                <LightningBoltIcon aria-hidden="true" />
              ) : (
                <img src={a(icon)} alt="" />
              )}''';s=s.replace(old,'<Icon path={id==="home"?mdiLightningBolt:id==="rank"?mdiTrophy:mdiSnake} size={1.125} aria-hidden="true"/>');p.write_text(s,encoding='utf-8')
p=Path('native/App.tsx');s=p.read_text(encoding='utf-8');old='0 1px 0 #17120e, 0 2px 0 #17120e, 0 3px 0 #17120e, 0 4px 0 #17120e, 0 5px 0 #17120e';new='0.6px 1px 0 #17120e, 1.2px 2px 0 #17120e, 1.8px 3px 0 #17120e, 2.4px 4px 0 #17120e, 3px 5px 0 #17120e';s=s.replace(old,new)
start=s.index('              {i === 0 ? (');end=s.index('\n\n              <Text',start);s=s[:start]+'''              <MaterialCommunityIcons name={i===0?'lightning-bolt':i===1?'trophy':'snake'} size={27} color="#15110e"/>
'''+s[end:]
s=s.replace('borderColor: "#15110e",\n                          borderRadius: 20,','borderColor: pins.includes(i)?"#15110e":"transparent",\n                          boxShadow:pins.includes(i)?"'+new+'":"none",\n                          borderRadius: 20,');p.write_text(s,encoding='utf-8')
