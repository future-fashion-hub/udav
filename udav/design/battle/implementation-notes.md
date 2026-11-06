# Battle screen implementation

| Before | After | Why |
| --- | --- | --- |
| Two horizontal tracks and manual shake button | Two independent diagonal circular meters, motion only | Matches the selected image and physical game mechanic |
| Collection sticker reused as hero | Dedicated full-body transparent battle mascot | Keeps the battle character distinct without dominating progress |
| Progress only increased | +7 per alternating vertical stroke, 550 ms idle grace, 7 points/second decay | Rewards continued movement and makes pauses meaningful |
| Rival ran regardless of sensor availability | Rival starts receiving time only after usable motion samples arrive | Avoids losing while sensor access is unavailable |
| Battle continued after navigating away | Listener/timer cleaned up on exit, outcome, or unmount | Prevents offscreen matches and duplicate scoring |

Score/header and protected mobile runtime preserved. Rival remains a local simulation.
Motion access uses DeviceMotionEvent; iOS permission is requested from the Start gesture.
Unsupported/denied states have a sensor reconnect action, never a manual shake action.

Validation: TypeScript/Vite build passed, runtime integrity passed (28 files),
3 pure detector/decay tests passed. Browser and physical device testing deliberately
not run per user instruction. See design-qa.md for the visual QA limitation.

Asset: public/assets/udav/battle-mascot.png. Built-in Image Gen prompt recorded in
battle-mascot-prompt.md. A native asset copy is available; native App.tsx unchanged.
Companion static review: public/battle-review.html, with actual project CSS/assets,
editable labels, per-element comments, token controls and Markdown export.

## Reference fidelity correction

| Before | After | Why |
| --- | --- | --- |
| Dela title and straight CSS underlines | Original reference lettering, marker strokes, rays and VS | Preserve the selected artwork exactly |
| Generic font for percentages | Locally bundled Titan One | Closer rounded numeral silhouette |
| Oversized rings/low avatars | Revised ring widths and avatars raised above rings | Match reference component proportions |
| Technical HTTPS copy and reconnect button | Removed from battle UI | Keep native gameplay focused |
| Native manual shake button and any-axis magnitude detector | Expo DeviceMotion vertical strokes and idle decay | Actual phone-controlled native battle |

Supersedes earlier note that native App.tsx was unchanged. Native sensor permission
is requested from Start; app background pauses gameplay. Rotational-only inputs
are not counted. Gyro data filters fast twists; acceleration provides translation.
Reference art is the original PNG, clipped at render time (not a regenerated approximation).
Titan One is bundled with its OFL license. Expo SDK58 compatible react-native-svg renders
live rings. Native lint and TypeScript are checked separately; no browser tests.

## One-viewport layout correction

| Before | After | Why |
| --- | --- | --- |
| Content in independently scrolling column | Fixed safe-area header and bounded battle stage | Keep header and exit on the same screen |
| Width-driven block heights | Uniform scale from available width and height | Preserve reference proportions on short/tall devices |
| Large player caption overlapping VS | 56% caption width and separate VS coordinates | Restore the reference diagonal spacing |
| Separate native layout proportions | Same794×1480 composition and coordinates | Keep mobile and browser presentation aligned |

TypeScript/Vite/runtime integrity and native TypeScript/ESLint passed. No browser
tests or screenshots taken. Visual acceptance remains with the user.
