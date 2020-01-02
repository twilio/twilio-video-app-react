import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import { Room } from 'twilio-video';
import useRoomState from './useRoomState';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../useVideoContext/useVideoContext');

const mockedVideoContext = useVideoContext as jest.Mock<any>;

describe('the useRoomState hook', () => {
  let mockRoom: Room;

  beforeEach(() => {
    mockRoom = new EventEmitter() as Room;
    mockedVideoContext.mockImplementation(() => ({
      room: mockRoom,
      isConnecting: false,
      localTracks: [],
      onError: () => {},
      onDisconnect: () => {},
    }));
  });

  it('should return "disconnected" by default', () => {
    const { result } = renderHook(useRoomState);
    expect(result.current).toBe('disconnected');
  });

  it('should return "connected" if the room state is connected', () => {
    mockRoom.state = 'connected';
    const { result } = renderHook(useRoomState);
    expect(result.current).toBe('connected');
  });

  it('should respond to the rooms "reconnecting" event', () => {
    const { result } = renderHook(useRoomState);
    act(() => {
      mockRoom.state = 'reconnecting';
      mockRoom.emit('reconnecting');
    });
    expect(result.current).toBe('reconnecting');
  });

  it('should respond to the rooms "reconnected" event', () => {
    const { result } = renderHook(useRoomState);
    act(() => {
      mockRoom.state = 'connected';
      mockRoom.emit('reconnected');
    });
    expect(result.current).toBe('connected');
  });

  it('should respond to the rooms "disconnected" event', () => {
    mockRoom.state = 'connected';
    const { result } = renderHook(useRoomState);
    expect(result.current).toBe('connected');
    act(() => {
      mockRoom.state = 'disconnected';
      mockRoom.emit('disconnected');
    });
    expect(result.current).toBe('disconnected');
  });

  it('should update when a new room object is provided', () => {
    const { result, rerender } = renderHook(useRoomState);
    expect(result.current).toBe('disconnected');

    act(() => {
      mockRoom = new EventEmitter() as Room;
      mockRoom.state = 'connected';
      mockedVideoContext.mockImplementation(() => ({
        room: mockRoom,
        isConnecting: false,
        localTracks: [],
        onError: () => {},
        onDisconnect: () => {},
      }));
    });

    rerender();

    expect(result.current).toBe('connected');
  });

  it('tear down old listeners when receiving a new room', () => {
    const originalMockRoom = mockRoom;
    const { rerender } = renderHook(useRoomState);
    expect(originalMockRoom.listenerCount('disconnected')).toBe(1);
    expect(originalMockRoom.listenerCount('reconnected')).toBe(1);
    expect(originalMockRoom.listenerCount('reconnecting')).toBe(1);

    act(() => {
      mockRoom = new EventEmitter() as Room;
      mockedVideoContext.mockImplementation(() => ({
        room: mockRoom,
        isConnecting: false,
        localTracks: [],
        onError: () => {},
        onDisconnect: () => {},
      }));
    });

    rerender();

    expect(originalMockRoom.listenerCount('disconnected')).toBe(0);
    expect(originalMockRoom.listenerCount('reconnected')).toBe(0);
    expect(originalMockRoom.listenerCount('reconnecting')).toBe(0);
  });
});
