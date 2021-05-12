import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import { Room } from 'twilio-video';
import useIsRecording from './useIsRecording';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../useVideoContext/useVideoContext');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the useIsRecording hook', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockRoom = new EventEmitter() as Room;
    mockRoom.isRecording = true;
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
  });

  it('should return true when "room.isRecording" is true', () => {
    const { result } = renderHook(() => useIsRecording());
    expect(result.current).toBe(true);
  });

  it('should return false when "room.isRecording" is false', () => {
    mockRoom.isRecording = false;
    const { result } = renderHook(() => useIsRecording());
    expect(result.current).toBe(false);
  });

  it('should respond to "recordingStopped" events', () => {
    const { result } = renderHook(() => useIsRecording());
    act(() => {
      mockRoom.emit('recordingStopped');
    });
    expect(result.current).toBe(false);
  });

  it('should respond to "recordingStarted" events', () => {
    mockRoom.isRecording = false;
    const { result } = renderHook(() => useIsRecording());
    act(() => {
      mockRoom.emit('recordingStarted');
    });
    expect(result.current).toBe(true);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useIsRecording());
    unmount();
    expect(mockRoom.listenerCount('recordingStarted')).toBe(0);
    expect(mockRoom.listenerCount('recordingStopped')).toBe(0);
  });
});
