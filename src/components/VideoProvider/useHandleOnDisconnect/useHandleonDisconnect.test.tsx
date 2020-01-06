import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import { Room } from 'twilio-video';

import useHandleOnDisconnect from './useHandleOnDisconnect';

describe('the useHandleonDisconnect hook', () => {
  let mockRoom: any = new EventEmitter();

  it('should react to the rooms "disconnected" event and invoke onDisconnect callback', () => {
    const mockOnDisconnect = jest.fn();
    renderHook(() => useHandleOnDisconnect(mockRoom, mockOnDisconnect));
    act(() => {
      mockRoom.emit('disconnected', 'disconnected');
    });
    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  it('should tear down old listeners when receiving a new room', () => {
    const originalMockRoom = mockRoom;
    const { rerender } = renderHook(() => useHandleOnDisconnect(mockRoom, () => {}));
    expect(originalMockRoom.listenerCount('disconnected')).toBe(1);

    act(() => {
      mockRoom = new EventEmitter() as Room;
    });

    rerender();

    expect(originalMockRoom.listenerCount('disconnected')).toBe(0);
    expect(mockRoom.listenerCount('disconnected')).toBe(1);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useHandleOnDisconnect(mockRoom, () => {}));
    unmount();
    expect(mockRoom.listenerCount('disconnected')).toBe(0);
  });
});
