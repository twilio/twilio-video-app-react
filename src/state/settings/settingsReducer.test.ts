import { settingsReducer, initialSettings } from './settingsReducer';

describe('the settingsReducer', () => {
  it('should set a setting from the name/value pair provided', () => {
    const result = settingsReducer(initialSettings, { name: 'clientTrackSwitchOffControl', value: 'auto' });
    expect(result).toEqual({
      bandwidthProfileMode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      trackSwitchOffMode: undefined,
      clientTrackSwitchOffControl: 'auto',
      contentPreferencesMode: 'auto',
    });
  });

  it('should set undefined when the value is "default"', () => {
    const result = settingsReducer(initialSettings, { name: 'bandwidthProfileMode', value: 'default' });
    expect(result).toEqual({
      bandwidthProfileMode: undefined,
      dominantSpeakerPriority: 'standard',
      maxAudioBitrate: '16000',
      clientTrackSwitchOffControl: 'auto',
      contentPreferencesMode: 'auto',
      trackSwitchOffMode: undefined,
    });
  });
});
