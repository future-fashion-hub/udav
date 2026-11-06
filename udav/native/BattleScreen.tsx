import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import Svg, { Circle } from "react-native-svg";

const art = require("./assets/udav/battle-reference.png");
const paper = "#fffaf2", ink = "#15110e";
type Rect = [number, number, number, number];
function ReferenceArt({ rect, width, label }: { rect: Rect; width: number; label?: string }) {
  const [x, y, w, h] = rect, scale = width / w;
  return <View accessible={!!label} accessibilityLabel={label} style={{ width, height: h * scale, overflow: "hidden" }}>
    <Image source={art} accessible={false} style={{ position: "absolute", width: 852 * scale, height: 1720 * scale, left: -x * scale, top: -y * scale }} />
  </View>;
}
function Dial({ value, label, avatar, size }: { value: number; label: string; avatar: ImageSourcePropType; size: number }) {
  const circumference = 2 * Math.PI * 86;
  const fraction = Math.max(0, Math.min(100, value)) / 100;
  const isYou = label === "Ты";
  return <View style={{ width: size }}>
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }} style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Circle cx={100} cy={100} r={86} fill="none" stroke={ink} strokeWidth={25} />
        <Circle cx={100} cy={100} r={86} fill="none" stroke={paper} strokeWidth={21} />
        {value > 0 && <>
          <Circle cx={100} cy={100} r={86} fill="none" stroke={ink} strokeWidth={25} strokeLinecap="round" rotation={-90} origin="100,100" strokeDasharray={[circumference * fraction, circumference]} />
          <Circle cx={100} cy={100} r={86} fill="none" stroke={isYou ? "#d6ff00" : "#c779ef"} strokeWidth={21} strokeLinecap="round" rotation={-90} origin="100,100" strokeDasharray={[circumference * fraction, circumference]} />
        </>}
      </Svg>
      <View pointerEvents="none" style={[{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }, { justifyContent: "center", alignItems: "center" }]}><Text style={[s.percent, { fontSize: isYou ? size * 112 / 425 : size * 100 / 380 }]}>{Math.round(value)}%</Text></View>
      <Image source={avatar} style={{ position: "absolute", width: size * .45, height: size * .45, left: size * .2, top: -size * .18, borderRadius: size, borderWidth: 2 * size / (isYou ? 425 : 380), borderColor: ink }} />
      <View style={{ position: "absolute", right: 0, top: -size * .1 }}><ReferenceArt rect={[360, 358, 100, 86]} width={size * .22} /></View>
    </View>
    <View style={{ alignSelf: "center", marginTop: 1 }}>
      {isYou ? <ReferenceArt rect={[22, 854, 242, 62]} width={size * .412} label="Ты" /> : label === "Саша" ? <ReferenceArt rect={[440, 1168, 310, 65]} width={size * .582} label="Саша" /> : <Text style={s.name}>{label}</Text>}
    </View>
  </View>;
}
export function BattleScreen({ width, you, rival, opponent, result, paused, onReplay, onHistory, onExit }: {
  width: number; you: number; rival: number; opponent: string; result: boolean | null; paused: boolean;
  onReplay: () => void; onHistory: () => void; onExit: () => void;
}) {
  const [available, setAvailable] = useState({ width, height: 0 });
  const scale = Math.min(available.width / 794, available.height / 1480);
  const arenaScale = result === null ? 1 : .84;
  const actionStyle = { borderWidth: 3 * scale, borderRadius: 28 * scale, boxShadow: [1,2,3,4,5].map(n => `${.6 * n * scale}px ${n * scale}px 0 #17120e`).join(", ") };
  const box = (x: number, y: number, w: number, h?: number) => ({ position: "absolute" as const, left: x * scale, top: y * scale, width: w * scale, ...(h === undefined ? {} : { height: h * scale }) });
  const status = result !== null ? result ? "+25 очков. Красиво!" : "В следующий раз дожмёшь!" : paused ? "Готов? Начинай трясти!" : you > rival + 2 ? "Ты впереди. Не сбавляй!" : rival > you + 2 ? "Догоняй, всё ещё впереди!" : "Ноздря в ноздрю!";
  return <View style={{ flex: 1 }} onLayout={event => setAvailable(event.nativeEvent.layout)}>
    <View style={{ width: 794 * scale, height: 1480 * scale, alignSelf: "center", opacity: scale ? 1 : 0 }}>
      <View style={box(67, 22, 660)}>{result === null ? <ReferenceArt rect={[45, 15, 770, 316]} width={660 * scale} label="Тряси до победы" /> : <Text style={[s.title, { fontSize: 56 * scale }]}>{result ? "Вот это победа!" : "Реванш за тобой"}</Text>}</View>
      <View style={box(result === null ? 0 : 63, 330, 794 * arenaScale, 900 * arenaScale)}>
        <View style={box(0, 90 * arenaScale, 425 * arenaScale)}><Dial value={you} label="Ты" avatar={require("./assets/udav/avatar-me.png")} size={425 * arenaScale * scale} /></View>
        <View style={box(358 * arenaScale, 452 * arenaScale, 100 * arenaScale)}><ReferenceArt rect={[210, 910, 198, 153]} width={100 * arenaScale * scale} label="Против" /></View>
        <View style={box(414 * arenaScale, 490 * arenaScale, 380 * arenaScale)}><Dial value={rival} label={opponent} avatar={require("./assets/udav/avatar-sasha.png")} size={380 * arenaScale * scale} /></View>
      </View>
      <View style={[box(0, result === null ? 1280 : 1060, 794, 130), s.cheer, { gap: 20 * scale }]}>
        <Image source={require("./assets/udav/battle-mascot.png")} style={{ width: 145 * scale, height: 145 * scale, resizeMode: "contain" }} />
        <View style={{ flex: 1 }}>
          {result === null && !paused && you > rival + 2 ? <ReferenceArt rect={[275, 1302, 550, 46]} width={629 * scale} label={status} /> : <Text accessibilityLiveRegion="polite" style={[s.status, { fontSize: 31 * scale, lineHeight: 40.3 * scale }]}>{status}</Text>}
          <ReferenceArt rect={[280, 1347, 525, 30]} width={629 * scale} />
        </View>
      </View>
      {result !== null && <View style={[box(0, 1200, 794, 110), { flexDirection: "row", gap: 22 * scale }]}>
        <Pressable accessibilityRole="button" onPress={onReplay} style={[s.action, actionStyle, { flex: 1, padding: 17 * scale, justifyContent: "center" }]}><Text style={[s.actionText, { fontSize: 28 * scale }]}>Ещё раз!</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={onHistory} style={[s.action, actionStyle, { flex: 1, padding: 17 * scale, backgroundColor: paper, justifyContent: "center" }]}><Text style={[s.actionText, { fontSize: 28 * scale }]}>История батлов</Text></Pressable>
      </View>}
      <Pressable accessibilityRole="button" onPress={onExit} style={[box(0, 1420, 794, 60), { alignItems: "center", justifyContent: "center" }]}><Text style={{ color: "#736d67", fontFamily: "UdavBody", fontSize: 34 * scale }}>Выйти из батла</Text></Pressable>
    </View>
  </View>;
}

const s = StyleSheet.create({
  percent: { fontFamily: "BattleNumbers", color: ink, letterSpacing: -1 },
  name: { fontFamily: "DelaGothicOne_400Regular", fontSize: 23, color: ink, textAlign: "center" },
  title: { fontFamily: "DelaGothicOne_400Regular", color: ink, fontSize: 30, marginBottom: 20 },
  cheer: { flexDirection: "row", gap: 8, alignItems: "center" },
  status: { fontFamily: "DelaGothicOne_400Regular", color: ink, fontSize: 14, lineHeight: 20 },
  action: { padding: 16, backgroundColor: "#d6ff00", borderWidth: 3, borderColor: ink, borderRadius: 28 },
  actionText: { fontFamily: "DelaGothicOne_400Regular", color: ink, fontSize: 16, textAlign: "center" },
});
