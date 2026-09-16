# remotion/ AGENTS.md

## Purpose
Remotion video generation - field recordings and compositions for project showcases. Renders React components to video files using the Remotion framework.

## Ownership
- **Scope**: Video components, composition definitions, rendering configuration
- **Parent**: Root AGENTS.md

## Local Contracts
- All compositions export a recording component that wraps `FieldRecording`
- `FieldRecording` is the reusable base component for screenshot-based recordings with captions
- Screenshots referenced via `staticFile()` must exist in `public/` directory
- Standard video settings: 1280x720, 30 FPS, 300 frames (10 seconds)
- Captions advance every 75 frames (2.5 seconds per caption)
- Register new compositions in `Root.tsx` with unique IDs

## Work Guidance
- **Adding a new composition**: Create a file in `compositions/`, export a component that renders `FieldRecording` with screenshot path, title, captions array, and `FRAMES_PER_BEAT` constant
- **Screenshot assets**: Place pre-optimized images in `public/projects/` and reference them with relative paths like `"projects/filename.webp"` (WebP, per the public/ contract — the .png sources were one-shot optimized away)
- **Caption timing**: Define captions as an array; each displays for `FRAMES_PER_BEAT` frames (default 75)
- **Styling**: Keep the field recording aesthetic (dark background #2E281E, cream text #F3EDE2, monospace font, REC indicator)
- **Registration**: Add the composition to `RemotionRoot` in `Root.tsx` with matching component import

## Verification
- Run `npx remotion preview` to verify compositions render correctly
- Check caption transitions align with expected timing
- Verify screenshot paths resolve to existing files in `public/`

## Child DOX Index
- `compositions/` - Video composition definitions (agent-canvas, pi-dash, thetell)
