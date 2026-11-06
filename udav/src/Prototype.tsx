import { Icon } from "@mdi/react";
import { mdiLightningBolt, mdiTrophy, mdiSnake } from "@mdi/js";
import { Pencil1Icon } from "@radix-ui/react-icons";
import "@fontsource/dela-gothic-one/cyrillic-400.css";
import "@fontsource/dela-gothic-one/latin-400.css";
import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { createStrokeDetector, decayProgress } from "./battle-motion";
import {
  MobileScroll,
  BottomSheet,
  KeyboardInput,
  useKeyboard,
} from "./mobile";
const a = (n: string) => `/assets/udav/${n}.png?v=11`;
const achievements = [
  {
    name: "Самый быстрый трясун дикого запада",
    desc: "Победи за 5 секунд",
    art: "sticker-0",
  },
  {
    name: "Твой удав в шоке",
    desc: "Отыграйся с отставания в 50%",
    art: "sticker-1",
  },
  {
    name: "Вялый удав",
    desc: "Проиграй, не заполнив половину шкалы",
    art: "sticker-2",
  },
  {
    name: "Скрестить шпаги",
    desc: "Сыграй первый дружеский батл",
    art: "sticker-3",
  },
  { name: "Душитель рекордов", desc: "Одержи 10 побед", art: "sticker-4" },
  {
    name: "Рука Таноса",
    desc: "Победи 6 раз подряд — собери все камни",
    art: "sticker-6",
  },
  {
    name: "Ночной шалун",
    desc: "Сыграй батл между 00:00 и 05:00",
    art: "sticker-7",
  },
  { name: "Классно настругал", desc: "Одержи 25 побед", art: "sticker-8" },
  {
    name: "Король трясунов",
    desc: "Займи первое место в рейтинге",
    art: "sticker-9",
  },
  {
    name: "Трясу не хуже бармена",
    desc: "Сыграй 20 батлов",
    art: "sticker-10",
  },
  { name: "Сделал яичницу", desc: "Победи два раза подряд", art: "sticker-11" },
  { name: "Дисциплина", desc: "Сыграй батлы 7 дней подряд", art: "sticker-12" },
  { name: "Лоботряс", desc: "Сыграй 10 батлов за день", art: "sticker-13" },
  { name: "Ну ты и драчун", desc: "Сыграй 50 батлов", art: "sticker-14" },
  {
    name: "До победы всего 15 сантиметров",
    desc: "Проиграй, заполнив не меньше 85% шкалы",
    art: "sticker-15",
  },
  { name: "Любитель печенек", desc: "Потерпи 10 поражений", art: "sticker-16" },
  {
    name: "Каждый трясёт как он хочет",
    desc: "Сыграй батлы с 5 разными соперниками",
    art: "sticker-17",
  },
  {
    name: "Вставил без тряски",
    desc: "Победи без единого встряхивания",
    art: "sticker-18",
  },
  {
    name: "Сделал милкшейк",
    desc: "Заполни шкалу за 10 секунд",
    art: "sticker-19",
  },
  { name: "Рука в мозолях", desc: "Сыграй 100 батлов", art: "sticker-20" },
  {
    name: "Сбрей свои джунгли",
    desc: "Победи после трёх поражений подряд",
    art: "sticker-21",
  },
  {
    name: "Первооткрыватель пещерок",
    desc: "Сыграй первый батл с новым соперником",
    art: "sticker-22",
  },
  {
    name: "Любитель норок",
    desc: "Сыграй батлы с 10 разными соперниками",
    art: "sticker-23",
  },
  {
    name: "Собиратель ракушек",
    desc: "Выставь на витрину три достижения",
    art: "sticker-24",
  },
  {
    name: "К бабушке за щавелем",
    desc: "Вернись к батлам после недельного перерыва",
    art: "sticker-25",
  },
  {
    name: "Вот это персик сорвал",
    desc: "Победи соперника с рейтингом выше на 300 очков",
    art: "sticker-26",
  },
  {
    name: "Подцепил целый букет",
    desc: "Открой 10 достижений",
    art: "sticker-27",
  },
  {
    name: "Потренируйся с огурцом",
    desc: "Проиграй три батла подряд",
    art: "sticker-28",
  },
  {
    name: "Смотрю фильмы 18+",
    desc: "Сыграй батл после 23:00",
    art: "sticker-29",
  },
  {
    name: "Занимаюсь эти каждый день",
    desc: "Сыграй хотя бы один батл 14 дней подряд",
    art: "sticker-30",
  },
  {
    name: "Женат но потрясти люблю",
    desc: "Сыграй 30 дружеских батлов",
    art: "sticker-31",
  },
  { name: "У меня 21 палец", desc: "Победи в 21 батле", art: "sticker-32" },
  {
    name: "Поднялся, но это не про рейтинг",
    desc: "Отыграйся с отставания в 70%",
    art: "sticker-33",
  },
  {
    name: "Люблю потрясти без воздуха",
    desc: "Сыграй 5 ночных батлов",
    art: "sticker-34",
  },
  { name: "Потрясающе", desc: "Одержи 50 побед", art: "sticker-35" },
  { name: "Вот это валына", desc: "Одержи 10 побед подряд", art: "sticker-36" },
  { name: "Волосатая рука", desc: "Сыграй 200 батлов", art: "sticker-37" },
];
function Stickers({
  ids,
  onSelect,
}: {
  ids: number[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className="sticker-showcase">
      {ids.map((i) => (
        <button
          className="showcase-sticker"
          key={i}
          aria-label={achievements[i].name}
          onClick={() => onSelect(i)}
        >
          <img src={a(achievements[i].art)} alt="" />
        </button>
      ))}
    </div>
  );
}

type Match = { won: boolean; time: string; opponent?: string };
type MotionState = "waiting" | "ready" | "denied" | "unsupported";
function ReferenceArt({ rect, label, className = "" }: { rect: [number, number, number, number]; label?: string; className?: string }) {
  const [x, y, w, h] = rect;
  return <span className={`reference-art ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ aspectRatio: `${w}/${h}` }}>
    <img src={a("battle-reference")} alt="" style={{ width: `${852 / w * 100}%`, left: `${-x / w * 100}%`, top: `${-y / h * 100}%` } as CSSProperties} />
  </span>;
}
function BattleFit({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(entry.contentRect.width / 794, entry.contentRect.height / 1480)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div className="battle-fit" ref={host}><div className="battle-fit-canvas" style={{ transform: `translateX(-50%) scale(${scale})`, visibility: scale ? "visible" : "hidden" }}>{children}</div></div>;
}
function BattleDial({ value, label, avatar, opponent = false }: {
  value: number; label: string; avatar: string; opponent?: boolean;
}) {
  const rounded = Math.round(value);
  return <div className={`battle-dial ${opponent ? "is-opponent" : "is-you"}`}>
    <div className="battle-ring" role="progressbar" aria-label={label}
      aria-valuenow={rounded} aria-valuemin={0} aria-valuemax={100}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle className="ring-outline" cx="100" cy="100" r="86" />
        <circle className="ring-track" cx="100" cy="100" r="86" />
        {value > 0 && <><circle className="ring-fill-outline" cx="100" cy="100" r="86" pathLength="100" strokeDasharray={`${value} 100`} />
        <circle className="ring-fill" cx="100" cy="100" r="86" pathLength="100" strokeDasharray={`${value} 100`} /></>}
      </svg>
      <strong className="battle-percent">{rounded}%</strong>
      <img className="battle-avatar" src={a(avatar)} alt="" />
      <ReferenceArt className="battle-rays" rect={[360, 358, 100, 86]} />
    </div>
    <b className="battle-player-name">{label === "Ты" ? <ReferenceArt rect={[22, 854, 242, 62]} label="Ты" /> : label === "Саша" ? <ReferenceArt rect={[440, 1168, 310, 65]} label="Саша" /> : label}</b>
  </div>;
}
export default function Prototype() {
  const [tab, setTab] = useState("home"),
    [sheet, setSheet] = useState(""),
    [name, setName] = useState("Данила"),
    [bio, setBio] = useState("Спокоен как удав. Пока не начался батл."),
    [points, setPoints] = useState(1240),
    [matches, setMatches] = useState<Match[]>([
      { won: true, time: "Вчера, 21:42", opponent: "Саша" },
      { won: false, time: "Вчера, 20:15", opponent: "Аня Анаконда" },
    ]),
    [pins, setPins] = useState([0, 1, 3]),
    [you, setYou] = useState(0),
    [rival, setRival] = useState(0),
    [result, setResult] = useState<boolean | null>(null),
    [playing, setPlaying] = useState(false),
    [copied, setCopied] = useState(false);
  const [motionState, setMotionState] = useState<MotionState>("waiting");
  const [battleOpponent, setBattleOpponent] = useState("Саша");
  const lastMotion = useRef(0);
  const starting = useRef(false);
  const [achievement, setAchievement] = useState(0),
    [achievementBack, setAchievementBack] = useState("");
  function showAchievement(i: number, back = "") {
    setAchievement(i);
    setAchievementBack(back);
    setPinNotice("");
    setSheet("achievement");
  }
  function toggleAchievement() {
    if (pins.includes(achievement)) {
      setPins((v) => v.filter((n) => n !== achievement));
      setPinNotice("");
    } else if (pins.length < 3) {
      setPins((v) => [...v, achievement]);
      setPinNotice("");
    } else setPinNotice("На витрине только 3 места. Сними один стикер.");
  }
  const [pinNotice, setPinNotice] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: "Саша",
    points: 1480,
  });
  const shell = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const screen = shell.current?.closest("[data-phone-screen]");
    if (!screen) return;
    const reset = () => {
      if (screen.scrollTop || screen.scrollLeft) {
        screen.scrollTop = 0;
        screen.scrollLeft = 0;
      }
    };
    reset();
    screen.addEventListener("scroll", reset, { passive: true });
    return () => screen.removeEventListener("scroll", reset);
  }, []);

  const keyboard = useKeyboard(),
    done = useRef(false),
    progress = useRef(0);
  useEffect(() => {
    if (sheet !== "edit" && keyboard.visible) keyboard.hide();
    const screen = shell.current?.closest("[data-phone-screen]");
    if (screen) {
      screen.scrollTop = 0;
      screen.scrollLeft = 0;
    }
  }, [sheet, keyboard.visible]);
  function go(t: string) {
    keyboard.hide();
    if (t !== "battle") { done.current = true; setPlaying(false); }
    setTab(t);
  }
  function finish(won: boolean) {
    if (done.current) return;
    done.current = true;
    setPlaying(false);
    setResult(won);
    setPoints((p) => Math.max(0, p + (won ? 25 : -15)));
    setMatches((m) => [
      {
        won,
        opponent: battleOpponent,
        time: new Date().toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...m,
    ]);
  }
  async function start() {
    if (starting.current) return;
    starting.current = true;
    setPlaying(false);
    let state: MotionState = "waiting";
    const Motion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<string>;
    };
    try {
      if (!window.isSecureContext || !Motion) state = "unsupported";
      else if (Motion.requestPermission && await Motion.requestPermission() !== "granted") state = "denied";
    } catch { state = "denied"; }
    setMotionState(state);
    if (sheet === "player") setBattleOpponent(selectedPlayer.name);
    else if (tab !== "battle") setBattleOpponent("Саша");
    setSheet("");
    go("battle");
    progress.current = 0;
    done.current = false;
    setYou(0);
    setRival(0);
    setResult(null);
    lastMotion.current = performance.now();
    setPlaying(state === "waiting");
    starting.current = false;
  }
  useEffect(() => {
    if (!playing || tab !== "battle") return;
    let n = 0;
    let lastTick = performance.now();
    let gravity: number | null = null;
    let received = false;
    const detect = createStrokeDetector();
    const onMotion = (event: DeviceMotionEvent) => {
      const raw = event.acceleration?.y;
      const fallback = event.accelerationIncludingGravity?.y;
      if (raw == null && fallback == null) return;
      if (!received) { received = true; setMotionState("ready"); }
      let vertical = raw;
      if (vertical == null && fallback != null) {
        gravity = gravity === null ? fallback : gravity * 0.9 + fallback * 0.1;
        vertical = fallback - gravity;
      }
      const now = performance.now();
      if (!done.current && vertical != null && detect(vertical, now)) {
        lastMotion.current = now;
        progress.current = Math.min(100, progress.current + 7);
        setYou(progress.current);
        if (progress.current >= 100) finish(true);
      }
    };
    window.addEventListener("devicemotion", onMotion);
    const unavailable = setTimeout(() => {
      if (!received) { setMotionState("unsupported"); setPlaying(false); }
    }, 3500);
    const id = setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min(250, now - lastTick);
      lastTick = now;
      if (done.current || !received || document.hidden) return;
      progress.current = decayProgress(progress.current, elapsed, now - lastMotion.current);
      setYou(progress.current);
      n = Math.min(100, n + elapsed * 0.004);
      setRival(n);
      if (n >= 100) finish(false);
    }, 100);
    return () => {
      clearInterval(id); clearTimeout(unavailable);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [playing, tab]);
  if (tab === "battle") return <div ref={shell} className="udav-shell">
    <main className="battle-page">
      <header className="inner-header battle-fixed-header">
        <button aria-label="На главную" onClick={() => go("home")}><img src={a("logo")} alt="УДАВ" /></button>
        <button className="score" onClick={() => go("rank")}>{points.toLocaleString("ru")} очков</button>
      </header>
      <BattleFit><section className={`battle-content ${result !== null ? "is-finished" : ""}`} data-fd-id="battle-content">
                  <h1 className="battle-title" data-fd-id="battle-title">{result === null ? <ReferenceArt rect={[45, 15, 770, 316]} label="Тряси до победы" /> : result ? "Вот это победа!" : "Реванш за тобой"}</h1>
                  <div className="battle-arena" data-fd-id="battle-arena">
                    <BattleDial value={you} label="Ты" avatar="avatar-me" />
                    <ReferenceArt className="battle-versus" rect={[210, 910, 198, 153]} label="Против" />
                    <BattleDial value={rival} label={battleOpponent} avatar="avatar-sasha" opponent />
                  </div>
                  <div className="battle-cheer" data-fd-id="battle-cheer">
                    <img src={a("battle-mascot")} alt="Удав настроен на победу" />
                    <div className="battle-cheer-copy"><p role="status">{result !== null ? (result ? "+25 очков. Красиво!" : "В следующий раз дожмёшь!") : motionState !== "ready" ? "Готов? Начинай трясти!" : you > rival + 2 ? <ReferenceArt rect={[275, 1302, 550, 46]} label="Ты впереди. Не сбавляй!" /> : rival > you + 2 ? "Догоняй, всё ещё впереди!" : "Ноздря в ноздрю!"}</p><ReferenceArt rect={[280, 1347, 525, 30]} /></div>
                  </div>
                  {result !== null && <div className="battle-result-actions">
                    <button className="primary" onClick={start}>Ещё раз!</button>
                    <button className="outline" onClick={() => go("profile")}>История батлов</button>
                  </div>}
                  <button className="battle-exit" onClick={() => go("home")}>Выйти из батла</button>
                </section></BattleFit>
    </main>
  </div>;
  return (
    <div ref={shell} className="udav-shell">
      <MobileScroll key={tab} className="udav-scroll">
        <main>
          {tab === "home" ? (
            <div className="home-art" data-fd-id="section-home">
              <div className="art-header">
                <img src={a("header")} alt="УДАВ" />
                <button
                  className="hotspot avatar-hotspot"
                  aria-label="Мой профиль"
                  onClick={() => go("profile")}
                />
                <button
                  className="hotspot points-hotspot"
                  aria-label={`${points} очков — рейтинг`}
                  onClick={() => go("rank")}
                >
                  {points !== 1240 && (
                    <span>{points.toLocaleString("ru")} очков</span>
                  )}
                </button>
              </div>
              <img
                className="hero"
                data-fd-id="art-snake"
                src={a("hero")}
                alt="Кто тут самый тряский? Удав с телефоном"
              />
              <button
                className="image-button nearby"
                aria-label="Саша рядом"
                onClick={() => setSheet("challenge")}
              >
                <img src={a("nearby-row")} alt="Саша • рядом" />
              </button>
              <button
                className="home-challenge"
                data-fd-id="btn-challenge"
                onClick={() => setSheet("challenge")}
              >
                <span>Вызвать на батл</span>
                <img className="challenge-bolt" src={a("bolt")} alt="" />
              </button>
              <button
                className="image-button invite"
                onClick={() => setSheet("invite")}
              >
                <img src={a("invite-button")} alt="Пригласить друга" />
              </button>
            </div>
          ) : (
            <div className={`inner-screen ${tab === "battle" ? "battle-screen" : ""}`}>
              <header className="inner-header">
                <button aria-label="На главную" onClick={() => go("home")}>
                  <img src={a("logo")} alt="УДАВ" />
                </button>
                <button className="score" onClick={() => go("rank")}>
                  {points.toLocaleString("ru")} очков
                </button>
              </header>
              {tab === "rank" && (
                <>
                  <p className="eyebrow">ЛИГА ТРЯСКИ</p>
                  <h1>Кто главный трясун?</h1>
                  <p>Победа +25 · Поражение −15</p>
                  <div className="ranking">
                    {[
                      { name: "Тряси_и_плачь", points: 2180 },
                      { name: "Аня Анаконда", points: 1925 },
                      { name: "Саша", points: 1480 },
                      { name, points },
                    ]
                      .sort((a, b) => b.points - a.points)
                      .map((u, i) => (
                        <button
                          className={
                            "rank-row " + (u.name === name ? "is-me" : "")
                          }
                          key={i}
                          onClick={() =>
                            u.name === name
                              ? go("profile")
                              : (setSelectedPlayer(u), setSheet("player"))
                          }
                        >
                          {i < 3 ? (
                            <img
                              className="rank-cup"
                              src={a(
                                ["cup-gold", "cup-silver", "cup-bronze"][i],
                              )}
                              alt={`${i + 1} место`}
                            />
                          ) : (
                            <b className="rank-position">{i + 1}</b>
                          )}
                          <img
                            src={a(
                              u.name === name ? "avatar-me" : "avatar-sasha",
                            )}
                            alt=""
                          />
                          <strong>
                            {u.name}
                            {u.name === name && (
                              <small>Это ты. Красавчик!</small>
                            )}
                          </strong>
                          <b className="rank-points">
                            {u.points.toLocaleString("ru")}
                          </b>
                        </button>
                      ))}
                  </div>
                  <p className="note">Демонстрационный рейтинг</p>
                </>
              )}
              {tab === "profile" && (
                <>
                  <div className="profile-top">
                    <div className="profile-avatar-wrap">
                      <img
                        className="profile-avatar"
                        src={a("avatar-me")}
                        alt="Мой аватар"
                      />
                      <img className="profile-crown" src={a("crown")} alt="" />
                      <button
                        className="profile-edit"
                        aria-label="Редактировать профиль"
                        onClick={() => setSheet("edit")}
                      >
                        <Pencil1Icon width={22} height={22} />
                      </button>
                    </div>
                    <p className="eyebrow">ТОТ ЕЩЁ УДАВ</p>
                    <h1>{name}</h1>
                    <p>{bio}</p>
                  </div>
                  <div className="stats">
                    <div>
                      <b>{matches.filter((m) => m.won).length}</b>Побед
                    </div>
                    <div>
                      <b>{points}</b>Очков
                    </div>
                    <div>
                      <b>{matches.length}</b>Батлов
                    </div>
                  </div>
                  <h2 className="profile-section-title">На витрине</h2>
                  <Stickers ids={pins} onSelect={(i) => showAchievement(i)} />
                  <button
                    className="outline"
                    onClick={() => {
                      setPinNotice("");
                      setSheet("achievements");
                    }}
                  >
                    Выбрать достижения · {pins.length}/3
                  </button>
                  <h2 className="profile-section-title">История батлов</h2>
                  {matches.length === 0 ? (
                    <div className="empty">
                      <p className="empty-copy">
                        Пока тихо. Самое время пошуметь!
                      </p>
                      <button className="primary" onClick={() => go("home")}>
                        Найти соперника
                      </button>
                    </div>
                  ) : (
                    matches.map((m, i) => (
                      <div className="history-row" key={i}>
                        <img src={a("avatar-sasha")} alt="" />
                        <strong>
                          {m.opponent || "Саша"}
                          <small>
                            {m.won ? "Победа!" : "Реванш ещё будет"} · {m.time}
                          </small>
                        </strong>
                        <b>{m.won ? "+25" : "−15"}</b>
                      </div>
                    ))
                  )}
                </>
              )}

            </div>
          )}
        </main>
      </MobileScroll>
      {tab !== "battle" && (
        <nav className="udav-nav" aria-label="Навигация">
          {[
            ["home", "Батлы", "nav-battle"],
            ["rank", "Рейтинг", "nav-cup"],
            ["profile", "Профиль", "nav-snake-profile"],
          ].map(([id, label, icon]) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => go(id)}
            >
              <Icon
                path={
                  id === "home"
                    ? mdiLightningBolt
                    : id === "rank"
                      ? mdiTrophy
                      : mdiSnake
                }
                size={1.125}
                aria-hidden="true"
              />
              {label}
            </button>
          ))}
        </nav>
      )}
      <BottomSheet
        snap={sheet === "achievements" ? 0.88 : 0.82}
        open={!!sheet}
        onOpenChange={(o) => {
          if (!o) setSheet("");
        }}
        title={
          sheet === "achievement"
            ? "Достижение"
            : sheet === "achievements"
              ? "Твоя коллекция"
              : sheet === "edit"
                ? "Твой змеиный стиль"
                : sheet === "invite"
                  ? "Позови своего удава"
                  : sheet === "player"
                    ? "Профиль игрока"
                    : "Батл с Сашей"
        }
      >
        <div className="udav-sheet-body">
          {sheet === "challenge" && (
            <>
              <img
                className="sheet-avatar"
                src={a("avatar-sasha")}
                alt="Саша"
              />
              <h2>Ну что, вздёрнем?</h2>
              <div className="opponent-stats">
                <div>
                  <b>42</b>
                  <span>Победы</span>
                </div>
                <div>
                  <b>17</b>
                  <span>Поражения</span>
                </div>
                <div>
                  <b>1 480</b>
                  <span>Рейтинг</span>
                </div>
              </div>
              <Stickers
                ids={[0, 1, 3]}
                onSelect={(i) => showAchievement(i, "challenge")}
              />

              <p>
                <b>Победа +25 · Поражение −15</b>
              </p>
              <button className="primary" onClick={start}>
                Начать батл
              </button>
            </>
          )}
          {sheet === "achievements" && (
            <>
              <div className="achievement-counter">
                На витрине: {pins.length}/3
              </div>
              <p className="selection-notice" role="status">
                {pinNotice}
              </p>
              <div className="achievement-grid">
                {achievements.map((b, i) => (
                  <button
                    key={b.art}
                    aria-label={b.name}
                    aria-pressed={pins.includes(i)}
                    onClick={() => showAchievement(i, "achievements")}
                  >
                    <img src={a(b.art)} alt="" />
                    {pins.includes(i) && (
                      <span className="sticker-slot">
                        {pins.indexOf(i) + 1}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button className="primary" onClick={() => setSheet("")}>
                Готово
              </button>
            </>
          )}
          {sheet === "achievement" && (
            <div className="achievement-detail">
              <img src={a(achievements[achievement].art)} alt="" />
              <h2>{achievements[achievement].name}</h2>
              <p>{achievements[achievement].desc}</p>
              {achievementBack !== "challenge" && (
                <>
                  <p className="selection-notice" role="status">
                    {pinNotice}
                  </p>
                  <button className="primary" onClick={toggleAchievement}>
                    {pins.includes(achievement)
                      ? "Снять с витрины"
                      : "Выставить на витрину"}
                  </button>
                </>
              )}
              <button
                className="outline"
                onClick={() => setSheet(achievementBack)}
              >
                Назад
              </button>
            </div>
          )}
          {sheet === "invite" && (
            <>
              <p>Отправь другу свой игровой код:</p>
              <strong className="invite-code">UDAV-DANILA</strong>
              <button
                className="primary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText("UDAV-DANILA");
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? "Код скопирован" : "Скопировать код"}
              </button>
              <p className="note">
                Подключение друзей появится вместе с сервером.
              </p>
            </>
          )}
          {sheet === "edit" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                keyboard.hide();
                setSheet("");
              }}
            >
              <label>
                Имя
                <KeyboardInput
                  required
                  maxLength={24}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                О себе
                <KeyboardInput
                  maxLength={100}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>
              <button className="primary" type="submit">
                Сохранить
              </button>
            </form>
          )}
          {sheet === "player" && (
            <>
              <img
                className="sheet-avatar"
                src={a("avatar-sasha")}
                alt="Саша"
              />
              <h2>{selectedPlayer.name}</h2>
              <div className="opponent-stats">
                <div>
                  <b>42</b>
                  <span>Победы</span>
                </div>
                <div>
                  <b>17</b>
                  <span>Поражения</span>
                </div>
                <div>
                  <b>{selectedPlayer.points.toLocaleString("ru")}</b>
                  <span>Рейтинг</span>
                </div>
              </div>
              <Stickers
                ids={[0, 1, 3]}
                onSelect={(i) => showAchievement(i, "player")}
              />
              <button className="primary" onClick={start}>
                Батл
              </button>
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
