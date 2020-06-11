import { act, renderHook } from '@testing-library/react-hooks';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';
import { EventEmitter } from 'events';

// mock enumerateDevices so that it behaves as if the user has already granted permissions to use local media.
// @ts-ignore
navigator.mediaDevices = { enumerateDevices: () => Promise.resolve([{ deviceId: 1, label: '1' }]) };

describe('the useLocalTracks hook', () => {
  afterEach(jest.clearAllMocks);

  it('should return an array of tracks and two functions', async () => {
    const { result, waitForNextUpdate } = renderHook(useLocalTracks);
    expect(result.current.localTracks).toEqual([]);
    await waitForNextUpdate();
    expect(result.current.localTracks).toEqual([expect.any(EventEmitter), expect.any(EventEmitter)]);
    expect(result.current.getLocalVideoTrack).toEqual(expect.any(Function));
  });

  it('should create local tracks when loaded', async () => {
    Date.now = () => 123456;
    const { waitForNextUpdate } = renderHook(useLocalTracks);
    await waitForNextUpdate();
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

  it('should respond to "stopped" events from the local video track', async () => {
    const { result, waitForNextUpdate } = renderHook(useLocalTracks);
    await waitForNextUpdate();
    expect(result.current.localTracks).toEqual([expect.any(EventEmitter), expect.any(EventEmitter)]);
    act(() => {
      result.current.localTracks[0].emit('stopped');
      result.current.localTracks[1].emit('stopped');
    });
    expect(result.current.localTracks).toEqual([]);
  });
});
