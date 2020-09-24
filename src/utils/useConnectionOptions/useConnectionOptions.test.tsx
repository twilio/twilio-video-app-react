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
      maxTracks: '',
      maxAudioBitrate: '',
      renderDimensionLow: undefined,
      renderDimensionStandard: undefined,
      renderDimensionHigh: undefined,
    };

    const result = {
      bandwidthProfile: {
        video: {
          maxTracks: 0,
          renderDimensions: {},
        },
      },
      dominantSpeaker: true,
      maxAudioBitrate: 0,
      networkQuality: { local: 1, remote: 1 },
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
    };

    mockUseAppState.mockImplementationOnce(() => ({ settings }));
    expect(useConnectionOptions()).toEqual(result);
  });

  it('should correctly generate settings', () => {
    const settings: Settings = {
      trackSwitchOffMode: 'detected',
      dominantSpeakerPriority: 'high',
      bandwidthProfileMode: 'collaboration',
      maxTracks: '100',
      maxAudioBitrate: '0',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      renderDimensionHigh: 'wide1080p',
    };

    const result = {
      bandwidthProfile: {
        video: {
          dominantSpeakerPriority: 'high',
          maxTracks: 100,
          mode: 'collaboration',
          renderDimensions: {
            high: {
              height: 1080,
              width: 1920,
            },
            low: {
              height: 90,
              width: 160,
            },
            standard: {
              height: 960,
              width: 1280,
            },
          },
        },
      },
      dominantSpeaker: true,
      maxAudioBitrate: 0,
      networkQuality: { local: 1, remote: 1 },
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
    };

    mockUseAppState.mockImplementationOnce(() => ({ settings }));
    expect(useConnectionOptions()).toEqual(result);
  });

  it('should disable simulcast when the room type is peer to peer', () => {
    const settings: Settings = {
      trackSwitchOffMode: 'detected',
      dominantSpeakerPriority: 'high',
      bandwidthProfileMode: 'collaboration',
      maxTracks: '100',
      maxAudioBitrate: '0',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      renderDimensionHigh: 'wide1080p',
    };

    mockUseAppState.mockImplementationOnce(() => ({ settings, roomType: 'peer-to-peer' }));
    expect(useConnectionOptions()).toMatchObject({ preferredVideoCodecs: [{ codec: 'VP8', simulcast: false }] });
  });

  it('should disable simulcast when the room type is "go"', () => {
    const settings: Settings = {
      trackSwitchOffMode: 'detected',
      dominantSpeakerPriority: 'high',
      bandwidthProfileMode: 'collaboration',
      maxTracks: '100',
      maxAudioBitrate: '0',
      renderDimensionLow: 'low',
      renderDimensionStandard: '960p',
      renderDimensionHigh: 'wide1080p',
    };

    mockUseAppState.mockImplementationOnce(() => ({ settings, roomType: 'go' }));
    expect(useConnectionOptions()).toMatchObject({ preferredVideoCodecs: [{ codec: 'VP8', simulcast: false }] });
  });
});
