import { useCurrentFrame } from 'remotion';
import { FieldRecording } from '../FieldRecording';

const captions = [
  'I spawn the dashboard against the live proxy and watch the panels come up.',
  'Traffic flows in — each card tracks latency and token burn per route.',
  'One route drifts, so I steer its limit down straight from the dashboard.',
  'Sweep done: the boards settle and the drift alert clears itself.',
];

export const FRAMES_PER_BEAT = 75;

export function PiDashRecording() {
  const frame = useCurrentFrame();
  const caption = captions[Math.min(captions.length - 1, Math.floor(frame / FRAMES_PER_BEAT))];
  return (
    <FieldRecording
      screenshot="projects/pi-dash.webp"
      title="pi-dash"
      caption={caption}
      durationInFrames={300}
      framesPerBeat={FRAMES_PER_BEAT}
    />
  );
}
