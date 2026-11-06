import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, TextInput, Modal, Keyboard, KeyboardAvoidingView, Platform, StatusBar, AppState, useWindowDimensions, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { pencilXml } from "./icons";
import { useFonts, DelaGothicOne_400Regular } from "@expo-google-fonts/dela-gothic-one";
import * as Clipboard from "expo-clipboard";
import { DeviceMotion } from "expo-sensors";
import { SafeAreaProvider, initialWindowMetrics, useSafeAreaInsets } from "react-native-safe-area-context";
import { BattleScreen } from "./BattleScreen";
import { createStrokeDetector, decayProgress } from "./battle-motion";
import { achievements, stickers } from "./achievements";
import { body, bodyBold, ink, lime, images, cups, v, FullImage, ComicButton, Header, Showcase, Navigation, OpponentStats, Collection, SheetBody } from "./Visual";
export default function App() { return <SafeAreaProvider initialMetrics={initialWindowMetrics}><UdavApp /></SafeAreaProvider>; }
type Match = { won: boolean; time: string; opponent?: string };
function UdavApp() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const top = Math.max(65, insets.top + 6);
  const bottom = Math.max(34, insets.bottom);
  const viewportHeight = height - (Platform.OS === "android" ? insets.bottom : 0);
  const homeWidth = Math.min(width, (viewportHeight - 150) * .492);
  const [fontsLoaded] = useFonts({ DelaGothicOne_400Regular, BattleNumbers: require("./assets/fonts/TitanOne-Regular.ttf"), UdavBody: require("./assets/fonts/Arimo-Regular.ttf"), UdavBodyBold: require("./assets/fonts/Arimo-Bold.ttf") });
  const [achievement, setAchievement] = useState(0),
    [achievementBack, setAchievementBack] = useState("");
  function showAchievement(i: number, back = "") {
    Keyboard.dismiss();
    setPinNotice("");
    setAchievement(i);
    setAchievementBack(back);
    setSheet("achievement");
  }
  function toggleAchievement() {
    setPinNotice("");
    if (pins.includes(achievement))
      setPins((v) => v.filter((n) => n !== achievement));
    else if (pins.length < 3) setPins((v) => [...v, achievement]);
    else setPinNotice("На витрине только 3 места. Сними один стикер.");
  }
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: "Саша",
    points: 1480,
  });
  const [tab, setTab] = useState("home"),
    [sheet, setSheet] = useState(""),
    [name, setName] = useState("Данила"),
    [bio, setBio] = useState("Спокоен как удав. Пока не начался батл."),
    [points, setPoints] = useState(1240),
    [history, setHistory] = useState<Match[]>([
      { won: true, time: "Вчера, 21:42", opponent: "Саша" },
      { won: false, time: "Вчера, 20:15", opponent: "Аня Анаконда" },
    ]),
    [pins, setPins] = useState([0, 1, 3]),
    [you, setYou] = useState(0),
    [rival, setRival] = useState(0),
    [playing, setPlaying] = useState(false),
    [result, setResult] = useState<boolean | null>(null),
    [sensor, setSensor] = useState(false);
  const done = useRef(false),
    progress = useRef(0),
    lastShake = useRef(0);
  const [battleOpponent, setBattleOpponent] = useState("Саша");
  const starting = useRef(false);
  const [pinNotice, setPinNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const finish = useCallback((won: boolean) => {
    if (done.current) return;
    done.current = true;
    setPlaying(false);
    setResult(won);
    setPoints((p) => Math.max(0, p + (won ? 25 : -15)));
    setHistory((h) => [
      {
        won,
        opponent: battleOpponent,
        time: new Date().toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...h,
    ]);
  }, [battleOpponent]);
  async function start() {
    if (starting.current) return;
    starting.current = true;
    try {
      const permission = await DeviceMotion.requestPermissionsAsync();
      setSensor(false);
      if (sheet === "player") setBattleOpponent(selectedPlayer.name);
      else if (tab !== "battle") setBattleOpponent("Саша");
      setSheet("");
      setTab("battle");
      setResult(null);
      setYou(0); setRival(0);
      progress.current = 0;
      lastShake.current = 0;
      done.current = false;
      setPlaying(permission.granted);
    } catch { setPlaying(false); }
    finally { starting.current = false; }
  }
  useEffect(() => {
    if (!playing || tab !== "battle") return;
    let active = true, foreground = AppState.currentState === "active", received = false, n = 0;
    let lastTick = Date.now(), gravity: number | null = null;
    let subscription: { remove: () => void } | undefined;
    const detect = createStrokeDetector();
    const appState = AppState.addEventListener("change", state => {
      foreground = state === "active";
      lastTick = Date.now(); lastShake.current = lastTick;
    });
    const timer = setInterval(() => {
      const now = Date.now(), elapsed = Math.min(250, now - lastTick);
      lastTick = now;
      if (!received || !foreground || done.current) return;
      progress.current = decayProgress(progress.current, elapsed, now - lastShake.current);
      setYou(progress.current);
      n = Math.min(100, n + elapsed * .004);
      setRival(n);
      if (n >= 100) finish(false);
    }, 100);
    (async () => {
      try {
        if (!await DeviceMotion.isAvailableAsync() || !active) return;
        DeviceMotion.setUpdateInterval(50);
        subscription = DeviceMotion.addListener(measurement => {
          if (!active || !foreground || done.current) return;
          received = true; setSensor(true);
          let vertical = measurement.acceleration?.y;
          if (vertical == null) {
            const raw = measurement.accelerationIncludingGravity.y;
            gravity = gravity === null ? raw : gravity * .9 + raw * .1;
            vertical = raw - gravity;
          }
          // DeviceMotion supplies gyro rotation as well as linear acceleration.
          // Reject fast twisting; the actual stroke is translation along phone Y.
          const rotation = measurement.rotationRate;
          if (rotation && Math.max(Math.abs(rotation.alpha), Math.abs(rotation.beta), Math.abs(rotation.gamma)) > 300) return;
          const now = Date.now();
          if (detect(vertical, now)) {
            lastShake.current = now;
            progress.current = Math.min(100, progress.current + 7);
            setYou(progress.current);
            if (progress.current >= 100) finish(true);
          }
        });
      } catch { if (active) setSensor(false); }
    })();
    return () => {
      active = false; clearInterval(timer); subscription?.remove(); appState.remove();
    };
  }, [playing, tab, finish]);
  function exitBattle(destination = "home") {
    done.current = true;
    setPlaying(false);
    setTab(destination);
  }
  function go(next: string) { Keyboard.dismiss(); if (next !== "battle") { done.current = true; setPlaying(false); } setTab(next); }
  function openSheet(next: string) { Keyboard.dismiss(); setPinNotice(""); setSheet(next); }
  const sheetTitle = sheet === "achievement" ? "Достижение" : sheet === "achievements" ? "Твоя коллекция" : sheet === "edit" ? "Твой змеиный стиль" : sheet === "invite" ? "Позови своего удава" : sheet === "player" ? "Профиль игрока" : "Батл с Сашей";
  if (!fontsLoaded) return <View style={v.app} />;
  return <View style={v.app}><View style={{ flex: 1, marginBottom: Platform.OS === "android" ? insets.bottom : 0 }}>
    <StatusBar barStyle="dark-content" />
    {tab === "home" ? <ScrollView contentContainerStyle={{ width: homeWidth, alignSelf: "center", paddingTop: 56, paddingBottom: 94 }}>
      <View>
        <FullImage source={images.header} width={homeWidth} />
        <Pressable accessibilityLabel="Мой профиль" onPress={() => go("profile")} style={{ position: "absolute", right: "2%", top: "20%", width: "17%", height: "67%" }} />
        <Pressable accessibilityLabel={`${points} очков — рейтинг`} onPress={() => go("rank")} style={{ position: "absolute", left: "47%", top: "38%", width: "33%", height: "30%", justifyContent: "center" }}>{points !== 1240 && <Text style={{ backgroundColor: lime, borderRadius: 30, textAlign: "center", fontFamily: body, fontSize: 14, fontWeight: "800", color: ink }}>{points.toLocaleString("ru")} очков</Text>}</Pressable>
      </View>
      <FullImage source={images.hero} width={homeWidth} />
      <Pressable accessibilityLabel="Саша рядом" onPress={() => openSheet("challenge")} style={{ height: homeWidth * 199 / 852, overflow: "hidden" }}><View style={{ left: homeWidth * .132, width: homeWidth * .705, overflow: "hidden" }}><FullImage source={images.nearby} width={homeWidth} /></View></Pressable>
      <Pressable accessibilityRole="button" onPress={() => openSheet("challenge")} style={[v.button, { width: "94.48%", minHeight: 64, alignSelf: "center", flexDirection: "row", gap: 12, alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, marginTop: 0, marginBottom: 5 }]}><Text style={[v.buttonText, { fontSize: 17, lineHeight: 22.1 }]}>Вызвать на батл</Text><Image source={images.bolt} style={{ width: 38, height: 38, resizeMode: "contain", transform: [{ translateY: 3 }] }} /></Pressable>
      <Pressable accessibilityLabel="Пригласить друга" onPress={() => openSheet("invite")} style={{ alignSelf: "center", marginTop: 2.35, marginBottom: 12 }}><FullImage source={images.invite} width={homeWidth * .561} /></Pressable>
    </ScrollView> : tab === "battle" ? <View style={{ flex: 1, paddingTop: top, paddingHorizontal: 20, paddingBottom: bottom + 8 }}>
      <View style={{ height: 62, marginBottom: 8 }}><Header points={points} onHome={() => go("home")} onRank={() => go("rank")} /></View>
      <BattleScreen width={width - 40} you={you} rival={rival} opponent={battleOpponent} result={result} paused={!sensor} onReplay={start} onHistory={() => exitBattle("profile")} onExit={() => exitBattle()} />
    </View> : <ScrollView key={tab} contentContainerStyle={[v.content, { paddingTop: top }]}>
      <Header points={points} onHome={() => go("home")} onRank={() => go("rank")} />
      {tab === "rank" && <>
        <Text style={[v.eyebrow, { marginTop: 0 }]}>ЛИГА ТРЯСКИ</Text><Text style={[v.title, { marginTop: 0, marginBottom: 2 }]}>Кто главный трясун?</Text><Text style={[v.body, { marginBottom: 0 }]}>Победа +25 · Поражение −15</Text>
        <View style={v.ranking}>{[{ name: "Тряси_и_плачь", points: 2180 }, { name: "Аня Анаконда", points: 1925 }, { name: "Саша", points: 1480 }, { name, points }].sort((a, b) => b.points - a.points).map((player, index) => <Pressable key={player.name} accessibilityRole="button" onPress={() => { if (player.name === name) go("profile"); else { setSelectedPlayer(player); openSheet("player"); } }} style={[v.rankRow, { backgroundColor: player.name === name ? lime : ["#f2e5ff", "#eee9e2", "#f2ddc7"][index] }]}>
          {index < 3 ? <Image source={cups[index]} style={v.rankCup} /> : <Text style={v.rankNumber}>{index + 1}</Text>}
          <Image source={player.name === name ? images.me : images.sasha} style={v.avatar} />
          <View style={{ flex: 1 }}><Text style={v.rankName}>{player.name}</Text>{player.name === name && <Text style={v.rankSub}>Это ты. Красавчик!</Text>}</View><Text style={v.rankPoints}>{player.points.toLocaleString("ru")}</Text>
        </Pressable>)}</View><Text style={v.note}>Демонстрационный рейтинг</Text>
      </>}
      {tab === "profile" && <>
        <View style={v.profileTop}><View style={v.avatarWrap}><Image source={images.me} style={v.profileAvatar} /><Image source={images.crown} style={v.crown} /><Pressable accessibilityLabel="Редактировать профиль" onPress={() => openSheet("edit")} style={v.edit}><SvgXml xml={pencilXml} width={22} height={22} color={ink} /></Pressable></View><Text style={[v.eyebrow, { marginTop: 0 }]}>ТОТ ЕЩЁ УДАВ</Text><Text style={v.profileName}>{name}</Text><Text style={[v.body, { textAlign: "center", marginBottom: 0 }]}>{bio}</Text></View>
        <View style={v.stats}>{[[history.filter(m => m.won).length, "Побед"], [points, "Очков"], [history.length, "Батлов"]].map(([value, label], index) => <View key={label} style={[v.stat, index === 1 && v.statMiddle]}><Text style={v.statNumber}>{value}</Text><Text style={v.small}>{label}</Text></View>)}</View>
        <Text style={v.h2}>На витрине</Text><Showcase ids={pins} onSelect={id => showAchievement(id)} /><ComicButton outline style={{ marginTop: 0, marginBottom: 0 }} onPress={() => openSheet("achievements")}>{`Выбрать достижения · ${pins.length}/3`}</ComicButton>
        <Text style={v.h2}>История батлов</Text>{history.length === 0 ? <View style={{ paddingVertical: 12 }}><Text style={[v.body, { textAlign: "center" }]}>Пока тихо. Самое время пошуметь!</Text><ComicButton onPress={() => go("home")}>Найти соперника</ComicButton></View> : history.map((match, index) => <View key={index} style={v.history}><Image source={images.sasha} style={v.historyAvatar} /><View style={{ flex: 1 }}><Text style={v.historyName}>{match.opponent || "Саша"}</Text><Text style={v.historySub}>{match.won ? "Победа!" : "Реванш ещё будет"} · {match.time}</Text></View><Text style={v.historyName}>{match.won ? "+25" : "−15"}</Text></View>)}
      </>}
    </ScrollView>}
    {tab !== "battle" && <Navigation tab={tab} bottom={bottom} onChange={go} />}
    <Modal visible={!!sheet} transparent animationType="slide" statusBarTranslucent onRequestClose={() => openSheet("")}>
      <KeyboardAvoidingView style={v.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Закрыть окно" onPress={() => openSheet("")} />
        <View style={[v.sheet, { maxHeight: height * (sheet === "achievements" ? .88 : .82), marginBottom: Platform.OS === "android" ? insets.bottom : 0 }]}>
          <Pressable accessibilityLabel="Закрыть окно" onPress={() => openSheet("")} style={v.handleZone}><View style={v.handle} /></Pressable><Text style={v.sheetTitle}>{sheetTitle}</Text>
          <SheetBody>
            {(sheet === "challenge" || sheet === "player") && <>
              <Image source={images.sasha} style={[v.sheetAvatar, { height: 65 * 197 / 169 }]} /><Text style={v.sheetH2}>{sheet === "player" ? selectedPlayer.name : "Ну что, вздёрнем?"}</Text><OpponentStats rating={sheet === "player" ? selectedPlayer.points : 1480} /><Showcase ids={[0, 1, 3]} onSelect={id => showAchievement(id, sheet)} />
              {sheet === "challenge" && <Text style={[v.body, { textAlign: "center", fontWeight: "700" }]}>Победа +25 · Поражение −15</Text>}
              <ComicButton onPress={() => { void start(); }}>{sheet === "player" ? "Батл" : "Начать батл"}</ComicButton>
            </>}
            {sheet === "achievements" && <><View style={v.counter}><Text style={v.counterText}>На витрине: {pins.length}/3</Text></View><Text accessibilityLiveRegion="polite" style={v.notice}>{pinNotice}</Text><Collection pins={pins} onSelect={id => showAchievement(id, "achievements")} /><ComicButton onPress={() => openSheet("")}>Готово</ComicButton></>}
            {sheet === "achievement" && <><Image source={stickers[achievement]} style={v.detailArt} /><Text style={v.detailTitle}>{achievements[achievement].name}</Text><Text style={[v.body, { textAlign: "center" }]}>{achievements[achievement].desc}</Text>{achievementBack !== "challenge" && <><Text style={v.notice}>{pinNotice}</Text><ComicButton onPress={toggleAchievement}>{pins.includes(achievement) ? "Снять с витрины" : "Выставить на витрину"}</ComicButton></>}<ComicButton outline style={{ backgroundColor: "#f1e7db" }} onPress={() => openSheet(achievementBack)}>Назад</ComicButton></>}
            {sheet === "invite" && <><Text style={[v.body, { textAlign: "center" }]}>Отправь другу свой игровой код:</Text><Text selectable style={{ fontFamily: bodyBold, fontWeight: "700", fontSize: 28, textAlign: "center", color: ink, paddingVertical: 25 }}>UDAV-DANILA</Text><ComicButton onPress={() => { void Clipboard.setStringAsync("UDAV-DANILA").then(() => setCopied(true)).catch(() => setCopied(false)); }}>{copied ? "Код скопирован" : "Скопировать код"}</ComicButton><Text style={v.note}>Подключение друзей появится вместе с сервером.</Text></>}
            {sheet === "edit" && <><Text style={v.label}>Имя</Text><TextInput accessibilityLabel="Имя" maxLength={24} value={name} onChangeText={setName} style={v.input} /><Text style={v.label}>О себе</Text><TextInput accessibilityLabel="О себе" maxLength={100} value={bio} onChangeText={setBio} style={v.input} /><ComicButton onPress={() => { if (name.trim()) openSheet(""); }}>Сохранить</ComicButton></>}
          </SheetBody>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </View></View>;
}
