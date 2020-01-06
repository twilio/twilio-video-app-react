import { act, renderHook } from '@testing-library/react-hooks';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';
import { EventEmitter } from 'events';

describe('the useLocalTracks hook', () => {
  it('should return an array of tracks and two functions', async () => {
    const { result, waitForNextUpdate } = renderHook(useLocalTracks);
    expect(result.current.localTracks).toEqual([]);
    await waitForNextUpdate();
    expect(result.current.localTracks).toEqual([expect.any(EventEmitter), expect.any(EventEmitter)]);
    expect(result.current.getLocalAudioTrack).toEqual(expect.any(Function));
    expect(result.current.getLocalVideoTrack).toEqual(expect.any(Function));
  });

  it('should be called with the correct arguments', async () => {
    const { waitForNextUpdate } = renderHook(useLocalTracks);
    await waitForNextUpdate();
    expect(Video.createLocalAudioTrack).toHaveBeenCalledWith({ name: 'microphone' });
    expect(Video.createLocalVideoTrack).toHaveBeenCalledWith({
      name: 'camera',
      width: { ideal: 1280 },
      height: { ideal: 720 },
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
