import { renderHook } from '@testing-library/react-hooks';
import useAudioMute from './useAudioMute';
import { useVideoContext } from '../context';

jest.mock('../context');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

jest.mock('../useTrackIsEnabled/useTrackIsEnabled', () => () => true);

describe('the useAudioMute hook', () => {
  it('should return the value from the useTrackIsEnabled hook', () => {
    const mockLocalTrack = {
      name: 'microphone',
      isEnabled: true,
      enable: jest.fn(),
      disable: jest.fn(),
    };

    mockUseVideoContext.mockImplementation(() => ({
      localTracks: [mockLocalTrack],
    }));

    const { result } = renderHook(() => useAudioMute());
    expect(result.current).toEqual([true, expect.any(Function)]);
  });

  describe('toggleAudioEnabled function', () => {
    it('should call track.disable when track is enabled', () => {
      const mockLocalTrack = {
        name: 'microphone',
        isEnabled: true,
        enable: jest.fn(),
        disable: jest.fn(),
      };

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [mockLocalTrack],
      }));

      const { result } = renderHook(() => useAudioMute());
      result.current[1]();
      expect(mockLocalTrack.disable).toHaveBeenCalled();
      expect(mockLocalTrack.enable).not.toHaveBeenCalled();
    });

    it('should call track.enable when track is disabled', () => {
      const mockLocalTrack = {
        name: 'microphone',
        isEnabled: false,
        enable: jest.fn(),
        disable: jest.fn(),
      };

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [mockLocalTrack],
      }));

      const { result } = renderHook(() => useAudioMute());
      result.current[1]();
      expect(mockLocalTrack.disable).not.toHaveBeenCalled();
      expect(mockLocalTrack.enable).toHaveBeenCalled();
    });
  });
});
