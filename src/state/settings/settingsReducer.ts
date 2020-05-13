import { Track, VideoBandwidthProfileOptions } from 'twilio-video';
import { RenderDimensionValue } from './renderDimensions';

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode: VideoBandwidthProfileOptions['mode'];
  maxTracks: string;
  maxAudioBitrate: string;
  renderDimensionLow?: RenderDimensionValue;
  renderDimensionStandard?: RenderDimensionValue;
  renderDimensionHigh?: RenderDimensionValue;
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
  renderDimensionStandard: '960p',
  renderDimensionHigh: 'wide1080p',
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
