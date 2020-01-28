import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import usePublicationIsTrackEnabled from './usePublicationIsTrackEnabled';

describe('the usePublicationIsTrackEnabled hook', () => {
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = new EventEmitter();
  });

  it('should return false when track is undefined', () => {
    const { result } = renderHook(() => usePublicationIsTrackEnabled(undefined));
    expect(result.current).toBe(false);
  });

  it('should return mockTrack.isTrackEnabled by default', () => {
    mockTrack.isTrackEnabled = false;
    const { result } = renderHook(() => usePublicationIsTrackEnabled(mockTrack));
    expect(result.current).toBe(false);
  });

  it('should return respond to "subscribed" events', async () => {
    mockTrack.isTrackEnabled = false;
    const { result } = renderHook(() => usePublicationIsTrackEnabled(mockTrack));
    act(() => {
      mockTrack.emit('trackEnabled');
    });
    expect(result.current).toBe(true);
  });

  it('should return respond to "unsubscribed" events', async () => {
    mockTrack.isTrackEnabled = true;
    const { result } = renderHook(() => usePublicationIsTrackEnabled(mockTrack));
    act(() => {
      mockTrack.emit('trackDisabled');
    });
    expect(result.current).toBe(false);
  });

  it('should clean up listeners on unmount', () => {
    mockTrack.isTrackEnabled = 'mockTrack';
    const { unmount } = renderHook(() => usePublicationIsTrackEnabled(mockTrack));
    unmount();
    expect(mockTrack.listenerCount('trackEnabled')).toBe(0);
    expect(mockTrack.listenerCount('trackDisabled')).toBe(0);
  });
});
