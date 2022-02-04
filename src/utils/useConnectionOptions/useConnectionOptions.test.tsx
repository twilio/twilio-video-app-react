import { Settings } from '../../state/settings/settingsReducer';
import { useAppState } from '../../state';
import useConnectionOptions from './useConnectionOptions';

const mockUseAppState = useAppState as jest.Mock<any>;
jest.mock('../../state');

describe('the useConnectionOptions function', () => {
  it('should remove any undefined values from settings', () => {
    const settings: Settings = {
      trackSwitchOffMode: undefined,
      dominantSpeakerPriority: undefined,
      bandwidthProfileMode: undefined,
      maxAudioBitrate: '',
      clientTrackSwitchOffControl: 'manual',
      contentPreferencesMode: 'auto',
    };

    const result = {
      bandwidthProfile: {
        video: {
          clientTrackSwitchOffControl: 'manual',
          contentPreferencesMode: 'auto',
        },
      },
      dominantSpeaker: true,
      maxAudioBitrate: 0,
      networkQuality: { local: 1, remote: 1 },
      preferredVideoCodecs: 'auto',
    };

    mockUseAppState.mockImplementationOnce(() => ({ settings }));
    expect(useConnectionOptions()).toEqual(result);
  });

  it('should correctly generate settings', () => {
    const settings: Settings = {
      trackSwitchOffMode: 'detected',
      dominantSpeakerPriority: 'high',
      bandwidthProfileMode: 'collaboration',
      maxAudioBitrate: '0',
      contentPreferencesMode: 'auto',
      clientTrackSwitchOffControl: 'manual',
    };

    const result = {
      bandwidthProfile: {
        video: {
          dominantSpeakerPriority: 'high',
          mode: 'collaboration',
          trackSwitchOffMode: 'detected',
          contentPreferencesMode: 'auto',
          clientTrackSwitchOffControl: 'manual',
        },
      },
      dominantSpeaker: true,
      maxAudioBitrate: 0,
      networkQuality: { local: 1, remote: 1 },
      preferredVideoCodecs: 'auto',
    };

    mockUseAppState.mockImplementationOnce(() => ({ settings }));
    expect(useConnectionOptions()).toEqual(result);
  });
});
