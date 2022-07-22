import { Track, VideoBandwidthProfile } from 'twilio-video';

const searchParams = new URLSearchParams(window.location.search);

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfile['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode: VideoBandwidthProfile['mode'];
  maxAudioBitrate: string;
  contentPreferencesMode?: 'auto' | 'manual';
  clientTrackSwitchOffControl?: 'auto' | 'manual';
  adaptiveSimulcast: string;
}

type SettingsKeys = keyof Settings;

export interface SettingsAction {
  name: SettingsKeys;
  value: string;
}

export const initialSettings: Settings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  bandwidthProfileMode: 'collaboration',
  maxAudioBitrate: '16000',
  contentPreferencesMode: 'auto',
  clientTrackSwitchOffControl: 'auto',
  adaptiveSimulcast: searchParams.get('adaptiveSimulcast') ?? 'true',
};

// This inputLabels object is used by ConnectionOptions.tsx. It is used to populate the id, name, and label props
// of the various input elements. Using a typed object like this (instead of strings) eliminates the possibility
// of there being a typo.
export const inputLabels = (() => {
  const target: any = {};
  for (const setting in initialSettings) {
    target[setting] = setting as SettingsKeys;
  }
  return target as { [key in SettingsKeys]: string };
})();

export function settingsReducer(state: Settings, action: SettingsAction) {
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
