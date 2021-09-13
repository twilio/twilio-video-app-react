export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 640,
  height: 480,
  frameRate: 15,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'TwilioVideoApp-selectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'TwilioVideoApp-selectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'TwilioVideoApp-selectedVideoInput';
