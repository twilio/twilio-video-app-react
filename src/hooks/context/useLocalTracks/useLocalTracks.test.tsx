import { renderHook } from '@testing-library/react-hooks';
import useLocalTracks from './useLocalTracks';
import Video from 'twilio-video';

describe('the useLocalTracks hook', () => {
  it('should return an array of tracks', async () => {
    const { result, waitForNextUpdate } = renderHook(useLocalTracks);
    expect(result.current).toEqual([]);
    await waitForNextUpdate();
    expect(result.current).toEqual(['mockTrack']);
  });

  it('should be called with the correct arguments', async () => {
    const { waitForNextUpdate } = renderHook(useLocalTracks);
    await waitForNextUpdate();
    expect(Video.createLocalTracks).toHaveBeenCalledWith({
      audio: { name: 'microphone' },
      video: { name: 'camera', width: { ideal: 1280 }, height: { ideal: 720 } },
    });
  });
});
