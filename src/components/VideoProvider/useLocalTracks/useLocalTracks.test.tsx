import { act, renderHook } from '@testing-library/react-hooks';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';
import { EventEmitter } from 'events';

describe('the useLocalTracks hook', () => {
  it('should return an array of tracks and a function', async () => {
    const { result, waitForNextUpdate } = renderHook(useLocalTracks);
    expect(result.current).toEqual([[], expect.any(Function)]);
    await waitForNextUpdate();
    expect(result.current).toEqual([[expect.any(EventEmitter), expect.any(EventEmitter)], expect.any(Function)]);
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
    act(() => {
      result.current[0][1].emit('stopped');
    });
    expect(result.current).toEqual([[expect.any(EventEmitter)], expect.any(Function)]);
  });
});
