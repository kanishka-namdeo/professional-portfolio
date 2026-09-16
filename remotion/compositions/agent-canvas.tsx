import { useCurrentFrame } from 'remotion';
import { FieldRecording } from '../FieldRecording';

const captions = [
  'I sketch the run on the design surface — every box a seat an agent can take.',
  'Coder and reviewer agents join the canvas and wire themselves to the panel.',
  'I press run; the cursor agent walks the nodes and fills each frame in order.',
  'Run complete — the review notes land back on the surface beside the work.',
];

export const FRAMES_PER_BEAT = 75;

export function AgentCanvasRecording() {
  const frame = useCurrentFrame();
  const caption = captions[Math.min(captions.length - 1, Math.floor(frame / FRAMES_PER_BEAT))];
  return (
    <FieldRecording
      screenshot="projects/agent-canvas.webp"
      title="AgentCanvas"
      caption={caption}
      durationInFrames={300}
      framesPerBeat={FRAMES_PER_BEAT}
    />
  );
}
