import { Track, VideoBandwidthProfileOptions } from 'twilio-video';

export type RenderDimension = 'low' | 'standard' | 'high' | 'default';

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode: VideoBandwidthProfileOptions['mode'];
  maxTracks: string;
  maxAudioBitrate: string;
  renderDimensionLow?: RenderDimension;
  renderDimensionStandard?: RenderDimension;
  renderDimensionHigh?: RenderDimension;
}

export interface SettingsAction {
  name: keyof Settings;
  value: string;
}

export const initialSettings: Settings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  bandwidthProfileMode: 'collaboration',
  maxTracks: '10',
  maxAudioBitrate: '16000',
  renderDimensionLow: 'low',
  renderDimensionStandard: 'standard',
  renderDimensionHigh: 'high',
};

export const labels = (() => {
  const target: any = {};
  for (const setting in initialSettings) {
    target[setting] = setting as keyof Settings;
  }
  return target as { [key in keyof Settings]: string };
})();

export function settingsReducer(state: Settings, action: SettingsAction) {
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
