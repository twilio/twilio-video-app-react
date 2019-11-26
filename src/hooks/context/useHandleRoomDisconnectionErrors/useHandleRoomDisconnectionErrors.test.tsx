import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';

import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors';
import { Room, TwilioError } from 'twilio-video';

describe('the useHandleRoomDisconnectionErrors hook', () => {
  let mockRoom: any = new EventEmitter();

  it('should do nothing if the room emits a "disconnected" event with no error', () => {
    const mockOnError = jest.fn();
    renderHook(() => useHandleRoomDisconnectionErrors(mockRoom, mockOnError));
    act(() => {
      mockRoom.emit('disconnected', 'disconnected');
    });
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should react to the rooms "disconnected" event and invoke onError callback if there is an error', () => {
    const mockOnError = jest.fn();
    renderHook(() => useHandleRoomDisconnectionErrors(mockRoom, mockOnError));
    act(() => {
      mockRoom.emit('disconnected', 'disconnected', 'mockError');
    });
    expect(mockOnError).toHaveBeenCalledWith('mockError');
  });

  it('should tear down old listeners when receiving a new room', () => {
    const originalMockRoom = mockRoom;
    const { rerender } = renderHook(() => useHandleRoomDisconnectionErrors(mockRoom, () => {}));
    expect(originalMockRoom.listenerCount('disconnected')).toBe(1);

    act(() => {
      mockRoom = new EventEmitter() as Room;
    });

    rerender();

    expect(originalMockRoom.listenerCount('disconnected')).toBe(0);
    expect(mockRoom.listenerCount('disconnected')).toBe(1);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useHandleRoomDisconnectionErrors(mockRoom, () => {}));
    unmount();
    expect(mockRoom.listenerCount('disconnected')).toBe(0);
  });
});
