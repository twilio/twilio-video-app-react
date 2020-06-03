import { settingsReducer, initialSettings } from './settingsReducer';
import { getResolution } from './renderDimensions';

describe('the settingsReducer', () => {
  it('should set a setting from the name/value pair provided', () => {
    const result = settingsReducer(initialSettings, { name: 'renderDimensionHigh', value: 'test' });
    expect(result).toEqual({
      bandwidthProfileMode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      maxTracks: '0',
      renderDimensionHigh: 'test',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      trackSwitchOffMode: undefined,
    });
  });

  it('should set undefined when the value is "default"', () => {
    const result = settingsReducer(initialSettings, { name: 'bandwidthProfileMode', value: 'default' });
    expect(result).toEqual({
      bandwidthProfileMode: undefined,
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      maxTracks: '0',
      renderDimensionHigh: 'wide1080p',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      trackSwitchOffMode: undefined,
    });
  });
});

describe('the getResolution function', () => {
  it('should correctly return a resolution', () => {
    const result = getResolution('720p');
    expect(result).toEqual({ width: 1280, height: 720 });
  });

  it('should return undefined when passed undefined', () => {
    expect(getResolution(undefined)).toBeUndefined();
  });
});
