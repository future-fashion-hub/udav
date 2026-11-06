# Browser → React Native parity, 2026-11-06

Browser application content is the visual master. Device bezels and simulated
status bars are browser runtime infrastructure; native uses the actual OS chrome.

| Before | After | Why |
| --- | --- | --- |
| Full home screenshot with overlays | Same individual header, hero, nearby row, CTA, invitation and navigation | Match browser composition and responsive width rule |
| Different ranking spacing and row colors | Matching icon/rank column, avatar, name, points and three place colors | Preserve identical row anatomy |
| Native profile omitted eyebrow and changed stats layout | Matching centered profile, crown/edit, wins–points–battles panel, showcase and history | Follow current browser profile |
| Generic modal with extra Close action | Same handle, title, paper body, selected slots, detail and edit/invitation content | Match browser sheet hierarchy |
| Independent font/icon sources | Identical static Arimo regular/bold, Dela, Titan binaries; original MDI paths and Radix pencil | Avoid platform fallback and icon drift |
| Native artwork copies could differ | Browser master assets synchronized; referenced file hashes tested | Prevent stale stickers and cropped/generated variants |
| Hardcoded system padding | Real safe-area context with browser-matching content dimensions | Keep app content below actual OS chrome |

Native remains React Native with real DeviceMotion, not a WebView. Presentation
components are in `native/Visual.tsx`; battle composition is in `BattleScreen.tsx`.
Both native and browser fonts carry their open licenses in their asset folders.

Validation completed:

- Browser TypeScript/Vite build and 28-file protected-runtime integrity check.
- Native TypeScript and Expo ESLint.
- Seven pure tests covering movement/decay and image/font/catalogue parity.
- Android Metro export and Hermes bytecode generation (`native/dist-parity`).

No browser tests, screenshots or physical-device pixel comparison were performed,
in accordance with the user's browser-testing preference and without an attached
device/emulator. These checks do not certify pixel-level equality. Visual acceptance
on a device at the same viewport, font scale and UI state remains outstanding.
