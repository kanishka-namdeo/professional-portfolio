import { AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate, staticFile } from 'remotion';

export const FPS = 30;

export function FieldRecording({
  screenshot, title, caption, durationInFrames, framesPerBeat,
}: { screenshot: string; title: string; caption: string; durationInFrames: number; framesPerBeat: number }) {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const beat = Math.floor(frame / framesPerBeat);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2E281E', padding: 40 }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img src={staticFile(screenshot)} style={{ width: '100%', transform: `scale(${zoom})`, transformOrigin: '40% 40%' }} />
      </AbsoluteFill>
      <Sequence from={0}>
        <div style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'monospace', color: '#F3EDE2', background: 'rgba(46,40,30,0.75)', padding: '4px 10px', fontSize: 18 }}>
          ● REC — {title}
        </div>
      </Sequence>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, fontFamily: 'monospace', color: '#F3EDE2', fontSize: 20 }}>
        {String(beat).padStart(2, '0')} — {caption}
      </div>
    </AbsoluteFill>
  );
}
