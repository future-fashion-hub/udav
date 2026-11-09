# Mobile Prototype Agent Guide

## Prototype Instructions

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. Do not replace it with a standalone page. Visual fidelity applies to app-owned content inside the device screen, not to template-owned device chrome.
- Keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.

## Approved app-specific design decisions (2026-11-05)

Keep the lime boa reference as mascot. Achievements use generated mascot stickers and user-editable showcase with at most three entries. Required achievement names: «Самый быстрый трясун дикого запада», «Твой удав в шоке», «Вялый удав», «Скрестить шпаги». Additions stay satirical and playful. Trophy cups use gold/silver/bronze with small relief faces; eyes, mouths and every facial detail must be the same metal as the cup, never white cartoon eyes or dark open mouths. Navigation dimensions stay the same across home/ranking/profile. Battle invitation heading is «Ну что, вздёрнем?», followed by opponent wins/losses and three showcase stickers, with no instructional demo paragraph. Leaderboard title: «Кто главный трясун?». Remove map pin from nearby row. Use heavy Cyrillic display lettering for live navigation and usernames; original logo lettering remains raster art.

## Latest visual refinements (2026-11-06; supersedes trophy-face guidance above)

Trophy cups must have NO eyes, mouths, nostrils or other face features. All achievement stickers, metal cups and mascot profile icon use real alpha-transparent PNGs, not cream rectangles or multiply blending. Achievement captions/descriptions appear only after clicking an image, including in the collection; keep accessible labels. Collection uses cream/lime with black offset shadows, numbered selected slots, maximum three showcase items. Score chip, edit profile, choose achievements and find opponent buttons use black offset shadows; profile action buttons have no stroke. Fixed bottom navigation spans full viewport width down to the bottom safe area with opaque paper background and larger buttons, without changing protected runtime files.

## Profile and ranking polish — 2026-11-06

Latest edit action is a round pencil button overlapping avatar upper right; this supersedes earlier request to keep a full-width edit button. Purple crown upper left is a lossless crop of the approved hero crown. Profile choose-achievements action matches find-opponent font size/padding/height. Comic buttons use fine black outline plus hard black offset shadow. Ranking reserves identical icon/rank-number columns and symmetric card insets for points. Section headings and empty-state text share the button's left alignment.

## Round 5 — 2026-11-06

Use one 3px black stroke token for outlined buttons, score chip, pencil and all collection tiles. Pencil has no shadow. Profile empty-state copy is centered. Navigation icons are black (transparent mascot/cup silhouettes and standard lightning icon). Achievement detail Back and pin/unpin actions have identical dimensions and typography. Portal-rendered sheets require `.udav-sheet-body` scope; `.udav-shell` does not contain those elements.

## Flush button bases — 2026-11-06

Button shadows use a shared vertical solid extrusion: zero horizontal offset and five contiguous 1px layers. This replaces diagonal 4×5px shadows on all live primary/outline controls, score chips and selected collection tiles; pencil remains shadowless. Native score/button styles use the equivalent boxShadow value. Stats panel unchanged.

## Latest navigation and selection rules — 2026-11-06

Navigation uses standard Material Design Icons lightning-bolt / trophy / snake, solid black, not generated mascot images. Button bases are contiguous diagonal layers ending at 3px right / 5px down (supersedes zero-horizontal-offset guidance). Collection tiles have black borders and comic bases only when selected. Keep a transparent same-width border on unselected tiles to avoid layout changes. Focus must preserve app-owned selected-tile shadows: phone runtime's generic focus shadow reset otherwise hides the first tile's base. Apply scoped overrides to app content, preserve protected runtime.

## Home CTA / battle refinements — 2026-11-06

Home challenge is a live comic button with smaller 17px display label, 20px equal side padding and inset bolt icon, shared 3px stroke/diagonal base. Opponent challenge stats include rating 1480 in addition to 42 wins/17 losses. Start label is «Начать батл», battle eyebrow «БАТЛ С САШЕЙ». Losing result copy has no −15 point line; scoring mechanics still subtract 15 and history retains result points. Initial history contains two mock matches (one win, one loss, separate opponents) and feeds counters. Battle illustration uses complete transparent sticker-1 with contain sizing, no clipped decorative crop.


## Leaderboard player sheet — 2026-11-06

Player profiles opened from ranking show wins, losses, their rating and three clickable showcase stickers, matching the home battle sheet. Remove demo copy; action label is «Батл».

The player-profile «Батл» action starts the battle immediately, without opening the challenge confirmation sheet.

## Рука Таноса — 2026-11-06

Seventh achievement uses sticker-6.png: existing lime boa with serious expression, Thanos helmet and Infinity Gauntlet fitted on its raised tail. True transparent PNG with white sticker edge, no lettering. Detail requirement: «Победи 6 раз подряд — собери все камни». Available in collection and selectable for the three-slot showcase.

## Distinct achievement expressions — 2026-11-06

Cowboy has confident squint and smirk; shocked boa has wide startled eyes and O-shaped gasp; fencing pair has a playful challenger and a serious focused rival. Preserve costumes, poses and transparent sticker presentation. Original images retained as sticker-N-original.png.

## Fencing anatomy correction — 2026-11-06

Fencing boas hold foils with tapering tails, never hands. Each tail must have a readable continuous contour, one grip wrap and a visible free pointed tip, without merging back into its body. Faces match the battle mascot: large protruding round eyes and rounded long boa snout; simple restrained expressions.

Latest fencing revision supersedes calm faces: angry round-eye glare and closed frown. Use one simple open oval coil per snake to avoid fused stacked coils; tails rise with distinct contours and visible pointed tips around foil grips.

## Fencing identity source — 2026-11-06

Regenerate fencing from the original home-page snake.png only, not earlier sticker variants. Preserve original mascot head shape, body proportions and scale texture; only expression changes to angry. Thick natural boa coils, tail-held foils, no self-fusion. Latest asset replaces prior thin/simple-coil directions.

## Permanent sticker workflow

Before creating mascot stickers read STICKER_GUIDE.md. Source identity is the original home snake.png only. Preserve proportions, face shape and texture; expressions, headwear, clothing, accessories and props may vary. No limbs or fused coils. Added achievements 7–14 include «Король трясунов» for first place and grayscale Anonymous «Дисциплина».

## Latest user refinements

Do not run browser tests: user checks UI themselves. Pose variation is allowed, preserving reference anatomy, proportions, relative dimensions and thickness. Remove «Король колбасни» from collection. Fencing uses proper protective mesh masks instead of headbands. Anonymous boa has no hood, narrow eye slits and one nostril nearer face. New defeat achievements: near-loss at >=85% progress; ten losses. Third addition: five distinct opponents. These are prototype requirement descriptions, not automatic unlock implementation.

Discipline latest: grayscale mafia fedora, no hood, smooth original boa neck without hump, one unbranched tail around phone with one visible free tip. Preserve narrow mask eye slits and single nostril. User explicitly requested opening site for manual inspection; no browser interaction tests.

Added «Вставил без тряски» (calm boa placing phone in dock) and «Сделал милкшейк» (soda-jerk boa holding strawberry milkshake). Keep same mascot, distinct eyes/mouth, transparent PNG. Requirement descriptions remain prototype metadata rather than automatic unlocks.

Nearby avatar and «Саша · рядом» form a centered group above home challenge. Center visible artwork, excluding the removed map pin and empty source-image space.

## Expanded collection 20–35

Sixteen additional mascot achievements use original snake.png identity, distinct eyes/mouth and costume/prop stories. See design/new-achievements-20-35.json for exact user names and proposed requirement descriptions. «Люблю потрясти без воздуха» is a safe astronaut in intact space helmet. Titles are preserved verbatim. No browser tests. Automatic unlocks remain unimplemented; descriptions are prototype metadata.

Latest collection: add «Вот это валына» and «Волосатая рука». Astronaut has no hose inside helmet or torso arm/sleeve. Film glasses have no extra pupils inside colored lenses; KEEP actual eyes/pupils behind and above glasses. No browser tests.

Astronaut life support: one EXTERNAL ribbed purple hose from backpack to helmet collar port. Nothing inside glass dome or across eyes. No torso arms.

## Selected battle screen — 2026-11-06

Use the selected diagonal dual circular progress mock (exec-a0a3ba33...). Keep the
existing logo/points header. Title «ТРЯСИ ДО ПОБЕДЫ». Replace head-only mascot with
the dedicated transparent full-body battle-mascot.png. No lightning before lead
status, no phone instruction illustration/caption, no manual shake button. Exit
has no underline. Alternating vertical phone acceleration fills progress; after
a short idle grace it drains to zero. Request sensor permission from Start user
gesture, expose denied/unsupported states; stop sensors and timers on exit/result.
Do not run browser tests; user performs visual/device acceptance.

## Battle reference fidelity and native sensors — 2026-11-06

Keep reference lettering/marker underlines/rays/VS via clipped original reference
art (battle-reference.png), while numbers and ring fills stay dynamic. Percentages
use locally bundled Titan One. Match ring/avatar proportions and diagonal layout.
Remove HTTPS instructional paragraph, reconnect-sensor button, and technical
sensor status from the battle UI. This is a React Native app: implement battle
in native/BattleScreen.tsx too. Expo DeviceMotion supplies linear acceleration
and gyro rotation; alternating vertical translation scores, idle decays, rapid
twisting does not score. Use native permission request at Start and cleanup on
exit/background/result. Browser preview retains optional browser motion support.

## Battle fits one viewport — 2026-11-06

Active and finished battle use a bounded viewport, not a ScrollView/MobileScroll.
Keep header below status/camera safe region. Fit a single 794×1480 reference
composition into both available width AND height, preserving aspect ratio.
Title, circles, avatars, VS, names, mascot/status and exit share one scale.
Player ring 440 units at (0,90), rival390 at (404,450) within900-unit arena.
Player name artwork is56%ofring, rival80%; VS has its own gap belowplayername.
Result actions fit within same composition. Native uses onLayout, browser
ResizeObserver; protected mobile runtime remains unchanged. No browser tests.

Latest size correction: title660units centered, player ring380at(20,90), rival340at(434,450), name artwork46%/65%ofring. VS120wideat(347,398), centered in diagonal gap, not below player caption. These supersede prior battle geometry.

Latest battle spacing: larger425/380ringsat(0,90)/(414,490). Keep name lettering at prior absolute size (41.2%/58.2%ofring). VS100wideat(358,452)inmiddle gap. Cheer top1280, exit top1420height60, allwithin1480canvas. Supersedes previous ring sizes.

## Browser/native visual parity — 2026-11-06

All native screens must follow the browser master, not separate approximations.
Home uses the same split header/hero/nearby/invite assets and height-based content
width formula, not a complete reference poster. Rank rows, profile stats/showcase/
history, bottom navigation, all sheet titles/bodies and achievement slots follow
current prototype.css. Native/Visual.tsx holds matched presentation components.
Native/achievements.ts is generated from the browser achievement catalogue.
Both platforms use identical Arimo Regular/Bold (Arial-compatible), Dela Gothic
One and Titan One font binaries, identical MDI paths/Radix pencil and PNG assets.
Native uses real safe-area insets and DeviceMotion; never embed the webpage in a
WebView to fake matching. Asset/font/catalogue parity is checked by tests. Browser
tests remain prohibited. Pixel-level acceptance needs real-device/screenshot
comparison and must not be claimed from build/TypeScript/asset checks alone.


## Android layout repair — 2026-11-09

Never let sticker Image intrinsic dimensions participate in Yoga auto-size layout.
Showcase/collection/detail images require explicit numeric width AND height derived
from the measured parent, with a bounded slot. No percentage-only Image width plus
aspectRatio in auto-height rows. Rank nickname Text must not have flex:1 in its
vertical parent: center the compact name/subtitle group as in HTML grid rows.
Do not mount battle SVG/art before a positive finite viewport scale is measured.
Handle incomplete initial motion samples and unavailable/denied sensor permissions
without aborting screen entry. Real-device crash/visual acceptance still required;
TypeScript, lint and bundle success cannot establish pixel equality or no crashes.

## Android performance and insets — 2026-11-09
Keep original sticker images and quality unchanged. Virtualize the collection in its own FlatList, never inside a ScrollView. Android bottom safe area is reserved once by the app wrapper; navigation adds only 4px. Home must fit without scrolling and show a live star/points chip. Launcher icon reuses the site logo on lime.
