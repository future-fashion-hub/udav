# Battle screen — 2026-11-06

Selected reference: exec-a0a3ba33-ba29-47ad-b5bc-4f89486f9dc4.png.
Implemented diagonal circular progress, original header, full-body generated mascot,
plain exit, no lightning or shaking-phone instruction graphic/button.

Browser capture and visual comparison intentionally omitted at the user's explicit
request not to run browser tests. User performs visual acceptance manually.
TypeScript/Vite build passed; runtime integrity passed for all 28 protected files.
Four detector/decay/parity unit tests passed. Native TypeScript checks passed.
Reference lettering, marker strokes, VS and names now use clipped original artwork;
percent numerals use locally bundled Titan One; ring geometry matches revised proportions.
Native BattleScreen and Expo DeviceMotion integration replace the previous native screen.
Technical sensor text and reconnect button have been removed from the UI.

final result: blocked

Only visual/browser QA is blocked by the user's preference; this is not a claim
that visual comparison passed. Physical device sensor behavior needs manual testing.

Latest: fixed one-viewport battle with safe header, uniform width/height scaling,
non-overlapping VS/captions. Browser build/runtime, native TypeScript and native
ESLint passed. Browser visual comparison remains intentionally unperformed.

Full native parity pass: home, ranking, profile, navigation and all sheets now
follow the browser master. Shared font binaries/icons and PNGs are used. Seven
logic/asset/catalogue tests pass; Android Metro/Hermes export passes. See
design/native-parity.md. Pixel-level comparison remains unperformed, so the visual
QA status stays blocked; compilation and asset parity are not visual QA.
