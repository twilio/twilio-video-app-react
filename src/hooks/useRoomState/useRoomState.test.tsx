import { renderHook, act } from '@testing-library/react-hooks';
import useRoomState from './useRoomState';
import EventEmitter from 'events';
import { useVideoContext, IVideoContext } from '../context';
import { Room } from 'twilio-video';

jest.mock('../context');

const mockedVideoContext = useVideoContext as jest.Mock<IVideoContext>;

describe('the useRoomState hook', () => {
  let mockRoom: Room;

  beforeEach(() => {
    mockRoom = new EventEmitter() as Room;
    mockedVideoContext.mockImplementation(() => ({
      room: mockRoom,
      isConnecting: false,
      localTracks: [],
    }));
  });

  it('should work', () => {
    const { result } = renderHook(useRoomState);
    expect(result.current).toBe('disconnected');
  });

  it('should work2', () => {
    mockRoom.state = 'connected';
    const { result } = renderHook(useRoomState);
    expect(result.current).toBe('connected');
  });

  it('should work3', () => {
    const { result } = renderHook(useRoomState);
    expect(result.current).toBe('disconnected');
    act(() => {
      mockRoom.state = 'reconnecting';
      mockRoom.emit('reconnecting');
    });
    expect(result.current).toBe('reconnecting');
  });

  it('should work4', () => {
    const { result, rerender } = renderHook(useRoomState);
    expect(result.current).toBe('disconnected');

    act(() => {
      mockRoom = new EventEmitter() as Room;
      mockRoom.state = 'connected';
      mockedVideoContext.mockImplementation(() => ({
        room: mockRoom,
        isConnecting: false,
        localTracks: [],
      }));
    });

    rerender();

    expect(result.current).toBe('connected');
  });
});
