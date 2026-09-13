import { Composition } from 'remotion';
import { AgentCanvasRecording } from './compositions/agent-canvas';
import { PiDashRecording } from './compositions/pi-dash';
import { TheTellRecording } from './compositions/thetell';
import { FPS } from './FieldRecording';

export function RemotionRoot() {
  return (
    <>
      <Composition id="agent-canvas" component={AgentCanvasRecording} durationInFrames={300} fps={FPS} width={1280} height={720} />
      <Composition id="pi-dash" component={PiDashRecording} durationInFrames={300} fps={FPS} width={1280} height={720} />
      <Composition id="thetell" component={TheTellRecording} durationInFrames={300} fps={FPS} width={1280} height={720} />
    </>
  );
}
