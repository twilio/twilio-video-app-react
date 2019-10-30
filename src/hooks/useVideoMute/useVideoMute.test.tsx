import { renderHook } from '@testing-library/react-hooks';
import useVideoMute from './useVideoMute';
import { useVideoContext } from '../context';

jest.mock('../context');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

jest.mock('../useTrackIsEnabled/useTrackIsEnabled', () => () => true);

describe('the useVideoMute hook', () => {
  it('should return the value from the useTrackIsEnabled hook', () => {
    const mockLocalTrack = {
      name: 'camera',
      isEnabled: true,
      enable: jest.fn(),
      disable: jest.fn(),
    };

    mockUseVideoContext.mockImplementation(() => ({
      localTracks: [mockLocalTrack],
    }));

    const { result } = renderHook(() => useVideoMute());
    expect(result.current).toEqual([true, expect.any(Function)]);
  });

  describe('toggleAudioEnabled function', () => {
    it('should call track.disable when track is enabled', () => {
      const mockLocalTrack = {
        name: 'camera',
        isEnabled: true,
        enable: jest.fn(),
        disable: jest.fn(),
      };

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [mockLocalTrack],
      }));

      const { result } = renderHook(() => useVideoMute());
      result.current[1]();
      expect(mockLocalTrack.disable).toHaveBeenCalled();
      expect(mockLocalTrack.enable).not.toHaveBeenCalled();
    });

    it('should call track.enable when track is disabled', () => {
      const mockLocalTrack = {
        name: 'camera',
        isEnabled: false,
        enable: jest.fn(),
        disable: jest.fn(),
      };

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [mockLocalTrack],
      }));

      const { result } = renderHook(() => useVideoMute());
      result.current[1]();
      expect(mockLocalTrack.disable).not.toHaveBeenCalled();
      expect(mockLocalTrack.enable).toHaveBeenCalled();
    });
  });
});
