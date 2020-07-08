import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useMediaStreamTrack from './useMediaStreamTrack';

describe('the useMediaStreamTrack hook', () => {
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = new EventEmitter();
    mockTrack.mediaStreamTrack = 'mockMediaStreamTrack';
  });

  it('should return undefined when track is undefined', () => {
    const { result } = renderHook(() => useMediaStreamTrack(undefined));
    expect(result.current).toBe(undefined);
  });

  it('should return mockTrack.mediaStreamTrack by default', () => {
    const { result } = renderHook(() => useMediaStreamTrack(mockTrack));
    expect(result.current).toBe('mockMediaStreamTrack');
  });

  it('should respond to "started" events', async () => {
    const { result } = renderHook(() => useMediaStreamTrack(mockTrack));
    act(() => {
      mockTrack.mediaStreamTrack = 'anotherMockMediaStreamTrack';
      mockTrack.emit('started');
    });
    expect(result.current).toBe('anotherMockMediaStreamTrack');
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useMediaStreamTrack(mockTrack));
    unmount();
    expect(mockTrack.listenerCount('started')).toBe(0);
  });
});
