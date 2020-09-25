import { act, renderHook } from '@testing-library/react-hooks';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';
import { useHasAudioInputDevices, useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';

jest.mock('../../../hooks/deviceHooks/deviceHooks');
const mockUseHasVideoInputDevices = useHasVideoInputDevices as jest.Mock<any>;
const mockUseHasAudioInputDevices = useHasAudioInputDevices as jest.Mock<any>;

mockUseHasAudioInputDevices.mockImplementation(() => true);
mockUseHasVideoInputDevices.mockImplementation(() => true);

describe('the useLocalTracks hook', () => {
  afterEach(jest.clearAllMocks);

  describe('the getAudioAndVideoTracks function', () => {
    it('should create local audio and video tracks', async () => {
      Date.now = () => 123456;
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      await act(async () => {
        result.current.getAudioAndVideoTracks();
        await waitForNextUpdate();
      });

      expect(Video.createLocalTracks).toHaveBeenCalledWith({
        audio: true,
        video: {
          frameRate: 24,
          width: 1280,
          height: 720,
          name: 'camera-123456',
        },
      });
    });

    it('should create a local audio track when no video devices are present', async () => {
      mockUseHasVideoInputDevices.mockImplementationOnce(() => false);

      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      await act(async () => {
        result.current.getAudioAndVideoTracks();
        await waitForNextUpdate();
      });

      expect(Video.createLocalTracks).toHaveBeenCalledWith({
        audio: true,
        video: false,
      });
    });

    it('should create a local video track when no audio devices are present', async () => {
      mockUseHasAudioInputDevices.mockImplementationOnce(() => false);

      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      await act(async () => {
        result.current.getAudioAndVideoTracks();
        await waitForNextUpdate();
      });

      expect(Video.createLocalTracks).toHaveBeenCalledWith({
        audio: false,
        video: {
          frameRate: 24,
          width: 1280,
          height: 720,
          name: 'camera-123456',
        },
      });
    });

    it('should not create any tracks when no input devices are present', async () => {
      mockUseHasAudioInputDevices.mockImplementationOnce(() => false);
      mockUseHasVideoInputDevices.mockImplementationOnce(() => false);

      const { result } = renderHook(useLocalTracks);

      await result.current.getAudioAndVideoTracks();

      expect(Video.createLocalTracks).not.toHaveBeenCalled();
    });

    it('should return an error when there is an error creating a track', async () => {
      (Video.createLocalTracks as jest.Mock<any>).mockImplementationOnce(() => Promise.reject('testError'));
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      act(() => {
        expect(result.current.getAudioAndVideoTracks()).rejects.toBe('testError');
      });

      await waitForNextUpdate();
    });
  });

  describe('the removeLocalVideoTrack function', () => {
    it('should call videoTrack.stop() and remove the videoTrack from state', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      // First, get tracks
      await act(async () => {
        result.current.getAudioAndVideoTracks();
        await waitForNextUpdate();
      });

      const initialVideoTrack = result.current.localTracks.find(track => track.kind === 'video');
      expect(initialVideoTrack!.stop).not.toHaveBeenCalled();
      expect(initialVideoTrack).toBeTruthy();

      act(() => {
        result.current.removeLocalVideoTrack();
      });

      expect(result.current.localTracks.some(track => track.kind === 'video')).toBe(false);
      expect(initialVideoTrack!.stop).toHaveBeenCalled();
    });
  });
});
