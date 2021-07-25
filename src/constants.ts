export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: { min: 640, max: 1280 },
  height: { min: 480, max: 720 },
  frameRate: 24,
};


// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'TwilioVideoApp-selectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'TwilioVideoApp-selectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'TwilioVideoApp-selectedVideoInput';