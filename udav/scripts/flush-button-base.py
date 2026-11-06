from pathlib import Path
p=Path('native/App.tsx');s=p.read_text(encoding='utf-8');old='''    shadowColor: "#17120e",
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,''';new='''    boxShadow: "0 1px 0 #17120e, 0 2px 0 #17120e, 0 3px 0 #17120e, 0 4px 0 #17120e, 0 5px 0 #17120e",''';s=s.replace(old,new);p.write_text(s,encoding='utf-8')
