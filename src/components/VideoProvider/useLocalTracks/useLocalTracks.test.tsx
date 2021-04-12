import { act, renderHook } from '@testing-library/react-hooks';
import { SELECTED_AUDIO_INPUT_KEY, SELECTED_VIDEO_INPUT_KEY, DEFAULT_VIDEO_CONSTRAINTS } from '../../../constants';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';
import useDevices from '../../../hooks/useDevices/useDevices';

jest.mock('../../../hooks/useDevices/useDevices');
const mockUseDevices = useDevices as jest.Mock<any>;

describe('the useLocalTracks hook', () => {
  beforeEach(() => {
    Date.now = () => 123456;
    mockUseDevices.mockImplementation(() => ({
      audioInputDevices: [{ deviceId: 'mockAudioDeviceId', kind: 'audioinput' }],
      videoInputDevices: [{ deviceId: 'mockVideoDeviceId', kind: 'videoinput' }],
      hasAudioInputDevices: true,
      hasVideoInputDevices: true,
    }));
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
      mockUseDevices.mockImplementation(() => ({
        audioInputDevices: [{ deviceId: 'mockAudioDeviceId', kind: 'audioinput' }],
        videoInputDevices: [],
        hasAudioInputDevices: true,
        hasVideoInputDevices: false,
      }));

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
      mockUseDevices.mockImplementation(() => ({
        audioInputDevices: [],
        videoInputDevices: [{ deviceId: 'mockVideoDeviceId', kind: 'videoinput' }],
        hasAudioInputDevices: false,
        hasVideoInputDevices: true,
      }));

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

    it('should set isAcquiringLocalTracks to true while acquiring tracks', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      expect(result.current.isAcquiringLocalTracks).toBe(false);

      act(() => {
        result.current.getAudioAndVideoTracks();
      });

      expect(result.current.isAcquiringLocalTracks).toBe(true);

      await act(async () => {
        await waitForNextUpdate();
      });

      expect(result.current.isAcquiringLocalTracks).toBe(false);
    });

    it('should ignore calls to getAudioAndVideoTracks while isAcquiringLocalTracks is true', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      act(() => {
        expect(result.current.isAcquiringLocalTracks).toBe(false);
        result.current.getAudioAndVideoTracks(); // This call is not ignored
      });

      expect(result.current.isAcquiringLocalTracks).toBe(true);
      result.current.getAudioAndVideoTracks(); // This call is ignored

      await act(async () => {
        await waitForNextUpdate();
      });

      expect(Video.createLocalTracks).toHaveBeenCalledTimes(1);
    });

    it('should not create any tracks when no input devices are present', async () => {
      mockUseDevices.mockImplementation(() => []);

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

  describe('the removeLocalAudioTrack function', () => {
    it('should call audioTrack.stop() and remove the audioTrack from state', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      // First, get tracks
      await act(async () => {
        result.current.getAudioAndVideoTracks();
        await waitForNextUpdate();
      });

      const initialAudioTrack = result.current.localTracks.find(track => track.kind === 'audio');
      expect(initialAudioTrack!.stop).not.toHaveBeenCalled();
      expect(initialAudioTrack).toBeTruthy();

      act(() => {
        result.current.removeLocalAudioTrack();
      });

      expect(result.current.localTracks.some(track => track.kind === 'audio')).toBe(false);
      expect(initialAudioTrack!.stop).toHaveBeenCalled();
    });
  });

  describe('the getLocalVideoTrack function', () => {
    it('should create a local video track', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      await act(async () => {
        result.current.getLocalVideoTrack();
        await waitForNextUpdate();
      });

      expect(Video.createLocalVideoTrack).toHaveBeenCalledWith({
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: 'camera-123456',
      });
    });

    it('should not specify a device ID when the device ID stored in local storage does not exist', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, 'device-id-does-not-exist');

      await act(async () => {
        result.current.getLocalVideoTrack();
        await waitForNextUpdate();
      });

      expect(Video.createLocalVideoTrack).toHaveBeenCalledWith({
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: 'camera-123456',
      });
    });

    it('should specify a device ID when one is stored in local storage and the device exists', async () => {
      const { result, waitForNextUpdate } = renderHook(useLocalTracks);

      window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, 'mockVideoDeviceId');

      await act(async () => {
        result.current.getLocalVideoTrack();
        await waitForNextUpdate();
      });

      expect(Video.createLocalVideoTrack).toHaveBeenCalledWith({
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: 'camera-123456',
        deviceId: { exact: 'mockVideoDeviceId' },
      });
    });
  });
});
