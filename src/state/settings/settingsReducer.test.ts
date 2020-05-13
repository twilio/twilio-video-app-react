import { settingsReducer, initialSettings } from './settingsReducer';

describe('the settingsReducer', () => {
  it('should set a setting from the name/value pair provided', () => {
    const result = settingsReducer(initialSettings, { name: 'renderDimensionHigh', value: 'test' });
    expect(result).toEqual({
      bandwidthProfileMode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      maxTracks: '10',
      renderDimensionHigh: 'test',
      renderDimensionLow: 'low',
      renderDimensionStandard: 'standard',
      trackSwitchOffMode: undefined,
    });
  });

  it('should set undefined when the value is "default"', () => {
    const result = settingsReducer(initialSettings, { name: 'bandwidthProfileMode', value: 'default' });
    expect(result).toEqual({
      bandwidthProfileMode: undefined,
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      maxTracks: '10',
      renderDimensionHigh: 'high',
      renderDimensionLow: 'low',
      renderDimensionStandard: 'standard',
      trackSwitchOffMode: undefined,
    });
  });
});
