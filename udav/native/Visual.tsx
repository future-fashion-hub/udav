import React, { useState } from "react";
import { Image, Pressable, FlatList, ScrollView, StyleSheet, Text, View, type ImageSourcePropType, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { navPaths } from "./icons";
import { achievements, stickers } from "./achievements";

export const paper = "#fffaf2", ink = "#15110e", lime = "#d6ff00", purple = "#c779ef";
export const display = "DelaGothicOne_400Regular", body = "UdavBody", bodyBold = "UdavBodyBold";
export const base = "0.6px 1px 0 #17120e, 1.2px 2px 0 #17120e, 1.8px 3px 0 #17120e, 2.4px 4px 0 #17120e, 3px 5px 0 #17120e";
export const images = {
  header: require("./assets/udav/header.png"), hero: require("./assets/udav/hero.png"), nearby: require("./assets/udav/nearby-row.png"),
  invite: require("./assets/udav/invite-button.png"), bolt: require("./assets/udav/bolt.png"), crown: require("./assets/udav/crown.png"),
  me: require("./assets/udav/avatar-me.png"), sasha: require("./assets/udav/avatar-sasha.png"), logo: require("./assets/udav/logo.png"),
};
export const cups = [require("./assets/udav/cup-gold.png"), require("./assets/udav/cup-silver.png"), require("./assets/udav/cup-bronze.png")];
export function FullImage({ source, width }: { source: ImageSourcePropType; width: number }) {
  const asset = Image.resolveAssetSource(source);
  return <Image source={source} style={{ width, height: width * (asset?.height ?? 1) / (asset?.width ?? 1) }} resizeMode="contain" />;
}
export function ComicButton({ children, onPress, outline = false, style }: { children: string; onPress: () => void; outline?: boolean; style?: ViewStyle }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [v.button, outline && { backgroundColor: paper }, style, pressed && { transform: [{ scale: .97 }] }]}><Text style={v.buttonText}>{children}</Text></Pressable>;
}
export function Header({ points, onHome, onRank }: { points: number; onHome: () => void; onRank: () => void }) {
  return <View style={v.header}><Pressable accessibilityRole="button" accessibilityLabel="На главную" onPress={onHome}><FullImage source={images.logo} width={112} /></Pressable><Pressable accessibilityRole="button" onPress={onRank} style={v.score}><Text style={v.scoreText}>{points.toLocaleString("ru")} очков</Text></Pressable></View>;
}
// Measure the row, not the PNG: Android can otherwise use the bitmap's intrinsic
// dimensions when percentage width/aspectRatio participate in an auto-sized row.
export function Showcase({ ids, onSelect }: { ids: number[]; onSelect: (id: number) => void }) {
  const [width, setWidth] = useState(0);
  const size = Math.max(0, (width - Math.max(0, ids.length - 1) * 8) / Math.max(1, ids.length));
  return <View style={[v.showcase, { height: size }]} onLayout={event => setWidth(event.nativeEvent.layout.width)}>{size > 0 && ids.map(id => <Pressable key={id} accessibilityRole="button" accessibilityLabel={achievements[id].name} onPress={() => onSelect(id)} style={{ width: size, height: size, flexShrink: 0, overflow: "hidden" }}><Image source={stickers[id]} style={{ width: size, height: size }} resizeMode="contain" /></Pressable>)}</View>;
}
export function DetailArt({ source }: { source: ImageSourcePropType }) {
  const [width, setWidth] = useState(0);
  const size = Math.min(240, width * .7);
  return <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ width: "100%", height: size, alignItems: "center" }}>{size > 0 && <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />}</View>;
}
export function Navigation({ tab, bottom, onChange }: { tab: string; bottom: number; onChange: (tab: string) => void }) {
  return <View style={[v.nav, { height: 58 + bottom, paddingBottom: bottom }]}>{[["home", "Батлы"], ["rank", "Рейтинг"], ["profile", "Профиль"]].map(([id, label], index) => <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: id === tab }} onPress={() => onChange(id)} style={[v.navItem, tab === id && { backgroundColor: lime }]}><Svg width={27} height={27} viewBox="0 0 24 24"><Path d={navPaths[index]} fill={ink} /></Svg><Text style={v.navText}>{label}</Text></Pressable>)}</View>;
}
export function OpponentStats({ rating }: { rating: number }) {
  return <View style={v.opponentStats}>{[[42, "Победы"], [17, "Поражения"], [rating.toLocaleString("ru"), "Рейтинг"]].map(([value, label]) => <View key={label} style={{ flex: 1, alignItems: "center" }}><Text style={v.opponentNumber}>{value}</Text><Text style={v.small}>{label}</Text></View>)}</View>;
}
// The collection owns its scroll viewport: never nest this list in SheetBody.
export function Collection({ pins, onSelect, onDone, notice }: { pins: number[]; onSelect: (id: number) => void; onDone: () => void; notice: string }) {
  const [width, setWidth] = useState(0);
  const size = Math.max(0, (width - 18) / 2);
  return <View style={{ flex: 1, paddingHorizontal: 18 }} onLayout={event => setWidth(event.nativeEvent.layout.width - 36)}>
    {size > 0 && <FlatList data={achievements} extraData={pins} numColumns={2} keyExtractor={item => item.art}
      initialNumToRender={6} maxToRenderPerBatch={4} windowSize={3} updateCellsBatchingPeriod={40}
      style={{ flexShrink: 1 }} contentContainerStyle={{ backgroundColor: paper, paddingBottom: 12 }} columnWrapperStyle={{ gap: 18 }}
      ListHeaderComponent={<><View style={v.counter}><Text style={v.counterText}>На витрине: {pins.length}/3</Text></View>{!!notice && <Text style={v.notice}>{notice}</Text>}</>}
      ListFooterComponent={<ComicButton onPress={onDone}>Готово</ComicButton>}
      renderItem={({ item, index: id }) => <Pressable accessibilityRole="button" accessibilityLabel={item.name} accessibilityState={{ selected: pins.includes(id) }} onPress={() => onSelect(id)} style={[v.tile, { width: size, height: size, marginBottom: 18 }, pins.includes(id) && v.selectedTile]}>
        <Image source={stickers[id]} style={{ width: Math.max(0, size - 16), height: Math.max(0, size - 16) }} resizeMode="contain" fadeDuration={0} />
        {pins.includes(id) && <View style={v.slot}><Text style={v.slotText}>{pins.indexOf(id) + 1}</Text></View>}
      </Pressable>} />}
  </View>;
}
export function SheetBody({ children }: { children: React.ReactNode }) {
  return <ScrollView style={{ flexGrow: 0, flexShrink: 1, width: "100%" }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}><View style={v.sheetBody}>{children}</View></ScrollView>;
}
export const v = StyleSheet.create({
  app: { flex: 1, backgroundColor: paper }, content: { paddingHorizontal: 20, paddingBottom: 78 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  score: { borderWidth: 3, borderColor: ink, boxShadow: base, backgroundColor: lime, borderRadius: 30, padding: 12 },
  scoreText: { fontFamily: bodyBold, fontSize: 16, fontWeight: "800", color: ink },
  title: { fontFamily: bodyBold, fontSize: 40, fontWeight: "900", lineHeight: 41.6, letterSpacing: -1.7, color: ink, marginTop: 10, marginBottom: 16 },
  body: { fontFamily: body, fontSize: 14, lineHeight: 21, color: ink, marginVertical: 14 },
  small: { fontFamily: body, fontSize: 12, lineHeight: 18, color: ink },
  eyebrow: { fontFamily: bodyBold, fontSize: 11, fontWeight: "800", letterSpacing: 2, color: ink, marginVertical: 15 },
  h2: { fontFamily: bodyBold, fontWeight: "700", fontSize: 22, letterSpacing: -.6, color: ink, marginTop: 26, marginBottom: 8, paddingLeft: 3 },
  button: { width: "100%", borderWidth: 3, borderColor: ink, backgroundColor: lime, borderRadius: 28, padding: 17, minHeight: 60, marginVertical: 14, boxShadow: base, justifyContent: "center" },
  buttonText: { fontFamily: display, fontSize: 14, lineHeight: 19.6, color: ink, textAlign: "center" },
  nav: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 6, paddingTop: 10, paddingHorizontal: 12, backgroundColor: paper, alignItems: "center" },
  navItem: { flex: 1, height: 44, flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 5, borderRadius: 25 },
  navText: { fontFamily: display, fontSize: 11, lineHeight: 13.2, color: ink },
  ranking: { marginTop: 30 }, rankRow: { flexDirection: "row", gap: 9, paddingVertical: 16, paddingHorizontal: 18, borderRadius: 22, marginBottom: 10, alignItems: "center" },
  rankCup: { width: 49, height: 60, resizeMode: "contain" }, rankNumber: { width: 49, height: 60, textAlign: "center", lineHeight: 60, fontFamily: display, fontSize: 21, color: ink },
  avatar: { width: 40, height: 40, borderRadius: 20 }, rankName: { fontFamily: display, fontSize: 13, lineHeight: 19.5, color: ink },
  rankPoints: { fontFamily: bodyBold, fontWeight: "700", fontSize: 13, color: ink }, rankSub: { fontFamily: body, fontSize: 11, lineHeight: 16.5, marginTop: 5, color: ink },
  note: { fontFamily: body, fontSize: 12, lineHeight: 18, textAlign: "center", color: "#756e66", marginVertical: 12 },
  profileTop: { paddingTop: 12, alignItems: "center" }, avatarWrap: { width: 110, height: 110, marginTop: 8, marginBottom: 18 },
  profileAvatar: { width: 110, height: 110, borderRadius: 55 }, crown: { position: "absolute", left: -27, top: -15, width: 47, height: 47, transform: [{ rotate: "-12deg" }] },
  edit: { position: "absolute", right: -9, top: -8, width: 42, height: 42, borderRadius: 21, backgroundColor: lime, borderWidth: 3, borderColor: ink, alignItems: "center", justifyContent: "center" },
  profileName: { fontFamily: display, fontSize: 34, lineHeight: 35.36, letterSpacing: -1.7, color: ink, marginTop: 0, marginBottom: 2 },
  stats: { flexDirection: "row", marginTop: 28, marginBottom: 2, backgroundColor: lime, borderRadius: 26, paddingVertical: 24, paddingHorizontal: 10, gap: 8, transform: [{ rotate: "-1deg" }], boxShadow: "4px 5px 0 #17120e" },
  stat: { flex: 1, alignItems: "center" }, statNumber: { fontFamily: display, fontSize: 27, color: ink, marginBottom: 6 }, statMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#15110e33" },
  showcase: { width: "100%", flexShrink: 0, flexDirection: "row", gap: 8, marginVertical: 18 },
  history: { flexDirection: "row", gap: 12, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#e5dfd5", alignItems: "center" }, historyAvatar: { width: 44, height: 44, borderRadius: 22 },
  historyName: { fontFamily: bodyBold, fontSize: 14, fontWeight: "700", color: ink }, historySub: { fontFamily: body, fontSize: 11, lineHeight: 16.5, color: ink, marginTop: 5 },
  overlay: { flex: 1, backgroundColor: "#0006", justifyContent: "flex-end" }, sheet: { backgroundColor: "#fff", borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: "hidden", minHeight: 260 },
  handleZone: { height: 30, alignItems: "center", justifyContent: "center" }, handle: { width: 42, height: 5, borderRadius: 999, backgroundColor: "#c9c9c4" },
  sheetTitle: { fontFamily: bodyBold, color: ink, fontWeight: "900", fontSize: 18, marginHorizontal: 18, marginBottom: 14 },
  sheetBody: { paddingTop: 12, paddingHorizontal: 10, paddingBottom: 30, backgroundColor: paper, borderRadius: 22, alignItems: "stretch" },
  sheetAvatar: { width: 65, height: 65, borderRadius: 33, alignSelf: "center" }, sheetH2: { fontFamily: bodyBold, fontSize: 24, fontWeight: "700", letterSpacing: -.6, color: ink, marginVertical: 12, textAlign: "center" },
  opponentStats: { flexDirection: "row", justifyContent: "space-around", marginVertical: 12 }, opponentNumber: { fontFamily: display, fontSize: 24, color: ink },
  counter: { alignSelf: "center", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 22, backgroundColor: lime, boxShadow: base, marginVertical: 12 }, counterText: { fontFamily: display, fontSize: 16, color: ink },
  notice: { fontFamily: body, fontSize: 12, lineHeight: 18, minHeight: 18, color: "#78229f", marginVertical: 12, textAlign: "center" },
  collection: { flexDirection: "row", flexWrap: "wrap", gap: 18, paddingTop: 14, paddingHorizontal: 4, paddingBottom: 24 },
  tile: { width: "46.8%", padding: 5, borderWidth: 3, borderColor: "transparent", borderRadius: 24 }, selectedTile: { borderColor: ink, backgroundColor: lime, boxShadow: base },
  slot: { position: "absolute", right: 8, top: 8, width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: ink }, slotText: { fontFamily: display, fontSize: 12, color: lime },
  detailArt: { width: "70%", maxWidth: 240, aspectRatio: 1, alignSelf: "center", resizeMode: "contain" }, detailTitle: { fontFamily: display, fontSize: 20, lineHeight: 28, color: ink, textAlign: "center", marginVertical: 12 },
  label: { fontFamily: body, fontSize: 14, color: ink, marginTop: 16 }, input: { fontFamily: body, fontSize: 14, borderWidth: 1, borderColor: "#d8cde0", borderRadius: 14, padding: 14, marginTop: 7, color: ink, backgroundColor: paper },
});
