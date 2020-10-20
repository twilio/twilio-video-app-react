import { act, renderHook } from '@testing-library/react-hooks';
import { SELECTED_AUDIO_INPUT_KEY, SELECTED_VIDEO_INPUT_KEY } from '../../../constants';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';
import { useAudioInputDevices, useVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';

jest.mock('../../../hooks/deviceHooks/deviceHooks');
const mockUseAudioInputDevices = useAudioInputDevices as jest.Mock<any>;
const mockUseVideoInputDevices = useVideoInputDevices as jest.Mock<any>;

describe('the useLocalTracks hook', () => {
  beforeEach(() => {
    Date.now = () => 123456;
    mockUseAudioInputDevices.mockImplementation(() => [{ deviceId: 'mockAudioDeviceId' }]);
    mockUseVideoInputDevices.mockImplementation(() => [{ deviceId: 'mockVideoDeviceId' }]);
  });
  afterEach(jest.clearAllMocks);
  afterEach(() => window.localStorage.clear());

  describe('the getAudioAndVideoTracks function', () => {
    it('should create local audio and video tracks', async () => {
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

    it('should correctly create local audio and video tracks when selected device IDs are available in localStorage', async () => {
      window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, 'mockVideoDeviceId');
      window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, 'mockAudioDeviceId');
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      await act(async () => {
        result.current.getAudioAndVideoTracks();
        await waitForNextUpdate();
      });

      expect(Video.createLocalTracks).toHaveBeenCalledWith({
        audio: {
          deviceId: {
            exact: 'mockAudioDeviceId',
          },
        },
        video: {
          frameRate: 24,
          width: 1280,
          height: 720,
          name: 'camera-123456',
          deviceId: {
            exact: 'mockVideoDeviceId',
          },
        },
      });
    });

    it('should correctly create local audio and video tracks when selected devices IDs are available in localStorage, but do not correspond to actual devices', async () => {
      window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, 'otherMockVideoDeviceId');
      window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, 'otherMockAudioDeviceId');
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
      mockUseVideoInputDevices.mockImplementation(() => []);

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
      mockUseAudioInputDevices.mockImplementation(() => []);

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
      mockUseAudioInputDevices.mockImplementation(() => []);
      mockUseVideoInputDevices.mockImplementation(() => []);

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
