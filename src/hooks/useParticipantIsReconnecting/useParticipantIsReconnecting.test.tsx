import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useParticipantIsReconnecting from './useParticipantIsReconnecting';

describe('the useParticipantIsReconnecting hook', () => {
  let mockParticipant: any;

  beforeEach(() => {
    mockParticipant = new EventEmitter();
  });

  it('should return false by default', () => {
    const { result } = renderHook(() => useParticipantIsReconnecting(mockParticipant));
    expect(result.current).toBe(false);
  });

  it('should return respond to "reconnecting" events', async () => {
    const { result } = renderHook(() => useParticipantIsReconnecting(mockParticipant));
    act(() => {
      mockParticipant.emit('reconnecting');
    });
    expect(result.current).toBe(true);
  });

  it('should return respond to "reconnected" events', async () => {
    const { result } = renderHook(() => useParticipantIsReconnecting(mockParticipant));
    act(() => {
      mockParticipant.emit('reconnecting');
    });
    expect(result.current).toBe(true);
    act(() => {
      mockParticipant.emit('reconnected');
    });
    expect(result.current).toBe(false);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useParticipantIsReconnecting(mockParticipant));
    unmount();
    expect(mockParticipant.listenerCount('reconnecting')).toBe(0);
    expect(mockParticipant.listenerCount('reconnected')).toBe(0);
  });
});
