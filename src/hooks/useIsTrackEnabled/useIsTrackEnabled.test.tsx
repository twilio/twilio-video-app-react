import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useIsTrackEnabled from './useIsTrackEnabled';

describe('the useIsTrackEnabled hook', () => {
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = new EventEmitter();
  });

  it('should return true when track is undefined', () => {
    const { result } = renderHook(() => useIsTrackEnabled(undefined));
    expect(result.current).toBe(true);
  });

  it('should return mockTrack.isEnabled by default', () => {
    mockTrack.isEnabled = false;
    const { result } = renderHook(() => useIsTrackEnabled(mockTrack));
    expect(result.current).toBe(false);
  });

  it('should return respond to "subscribed" events', async () => {
    mockTrack.isEnabled = false;
    const { result } = renderHook(() => useIsTrackEnabled(mockTrack));
    act(() => {
      mockTrack.emit('enabled');
    });
    expect(result.current).toBe(true);
  });

  it('should return respond to "unsubscribed" events', async () => {
    mockTrack.isEnabled = true;
    const { result } = renderHook(() => useIsTrackEnabled(mockTrack));
    act(() => {
      mockTrack.emit('disabled');
    });
    expect(result.current).toBe(false);
  });

  it('should clean up listeners on unmount', () => {
    mockTrack.isEnabled = 'mockTrack';
    const { unmount } = renderHook(() => useIsTrackEnabled(mockTrack));
    unmount();
    expect(mockTrack.listenerCount('enabled')).toBe(0);
    expect(mockTrack.listenerCount('disabled')).toBe(0);
  });
});
