import { useCurrentFrame } from 'remotion';
import { FieldRecording } from '../FieldRecording';

const captions = [
  'I hand two agents the same signals and let them argue the read.',
  'The bull cites order flow; the bear reads the same tape colder.',
  'They trade objections across the table while I keep score of each claim.',
  'Verdict: the room lands on one tell, and I log the dissent for later.',
];

export const FRAMES_PER_BEAT = 75;

export function TheTellRecording() {
  const frame = useCurrentFrame();
  const caption = captions[Math.min(captions.length - 1, Math.floor(frame / FRAMES_PER_BEAT))];
  return (
    <FieldRecording
      screenshot="projects/thetell.webp"
      title="thetell"
      caption={caption}
      durationInFrames={300}
      framesPerBeat={FRAMES_PER_BEAT}
    />
  );
}
