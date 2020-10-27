export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: { min: 640, max: 1280, ideal: 1280 },
  height: { min: 480, max: 720, ideal: 720 },
  frameRate: 24,
};
