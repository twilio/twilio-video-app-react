import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useIsTrackSwitchedOff from './useIsTrackSwitchedOff';

describe('the useIsTrackSwitchedOff hook', () => {
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = new EventEmitter();
  });

  it('should return false when track is undefined', () => {
    const { result } = renderHook(() => useIsTrackSwitchedOff(undefined));
    expect(result.current).toBe(false);
  });

  it('should return mockTrack.isSwitchedOff by default', () => {
    mockTrack.isSwitchedOff = true;
    const { result } = renderHook(() => useIsTrackSwitchedOff(mockTrack));
    expect(result.current).toBe(true);
  });

  it('should return respond to "switchedOff" events', async () => {
    mockTrack.isSwitchedOff = false;
    const { result } = renderHook(() => useIsTrackSwitchedOff(mockTrack));
    act(() => {
      mockTrack.isSwitchedOff = true;
      mockTrack.emit('switchedOff');
    });
    expect(result.current).toBe(true);
  });

  it('should return respond to "switchedOn" events', async () => {
    mockTrack.isEnabled = true;
    const { result } = renderHook(() => useIsTrackSwitchedOff(mockTrack));
    act(() => {
      mockTrack.isSwitchedOff = false;
      mockTrack.emit('switchedOn');
    });
    expect(result.current).toBe(false);
  });

  it('should clean up listeners on unmount', () => {
    mockTrack.isEnabled = 'mockTrack';
    const { unmount } = renderHook(() => useIsTrackSwitchedOff(mockTrack));
    unmount();
    expect(mockTrack.listenerCount('switchedOff')).toBe(0);
    expect(mockTrack.listenerCount('switchedOn')).toBe(0);
  });
});
