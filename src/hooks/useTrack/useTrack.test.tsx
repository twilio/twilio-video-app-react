import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useTrack from './useTrack';

describe('the useTrack hook', () => {
  let mockPublication: any;

  beforeEach(() => {
    mockPublication = new EventEmitter();
  });

  it('should return mockPublication.track by default', () => {
    mockPublication.track = 'mockTrack';
    const { result } = renderHook(() => useTrack(mockPublication));
    expect(result.current).toBe('mockTrack');
  });

  it('should return respond to "subscribed" events', async () => {
    mockPublication.track = 'mockTrack';
    const { result } = renderHook(() => useTrack(mockPublication));
    act(() => {
      mockPublication.emit('subscribed', 'newMockTrack');
    });
    expect(result.current).toBe('newMockTrack');
  });

  it('should return respond to "unsubscribed" events', async () => {
    mockPublication.track = 'mockTrack';
    const { result } = renderHook(() => useTrack(mockPublication));
    act(() => {
      mockPublication.emit('unsubscribed');
    });
    expect(result.current).toBe(null);
  });

  it('should clean up listeners on unmount', () => {
    mockPublication.track = 'mockTrack';
    const { unmount } = renderHook(() => useTrack(mockPublication));
    unmount();
    expect(mockPublication.listenerCount('subscribed')).toBe(0);
    expect(mockPublication.listenerCount('unsubscribed')).toBe(0);
  });
});
