import { act, renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import useScreenShareParticipant from './useScreenShareParticipant';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../useVideoContext/useVideoContext');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;

function MockRoom() {
  const mockRoom = new EventEmitter() as any;
  const mockLocalParticipant = new EventEmitter() as any;
  mockLocalParticipant.tracks = new Map();

  mockRoom.localParticipant = mockLocalParticipant;
  mockRoom.state = 'connected';
  mockRoom.participants = new Map();
  return mockRoom;
}

mockUseVideoContext.mockImplementation(() => ({
  room: MockRoom(),
  onError: () => {},
}));

describe('the useScreenShareParticipant hook', () => {
  it('return undefined when there are no participants sharing their screen', () => {
    const { result } = renderHook(useScreenShareParticipant);
    expect(result.current).toEqual(undefined);
  });

  it('should return the localParticipant when they are sharing their screen', () => {
    const mockRoom = MockRoom();
    mockRoom.localParticipant.tracks = new Map([[0, { trackName: 'screen' }]]);
    mockUseVideoContext.mockImplementation(() => ({
      room: mockRoom,
      onError: () => {},
    }));

    const { result } = renderHook(useScreenShareParticipant);
    expect(result.current).toEqual(mockRoom.localParticipant);
  });

  it('should return a remoteParticipant when they are sharing their screen', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'screen' }]]),
    };
    mockRoom.participants = new Map([[0, mockParticipant]]);
    mockUseVideoContext.mockImplementation(() => ({
      room: mockRoom,
      onError: () => {},
    }));

    const { result } = renderHook(useScreenShareParticipant);
    expect(result.current).toEqual(mockParticipant);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the localParticipant', () => {
    const mockRoom = MockRoom();
    mockUseVideoContext.mockImplementation(() => ({
      room: mockRoom,
      onError: () => {},
    }));

    const { result } = renderHook(useScreenShareParticipant);
    expect(result.current).toEqual(undefined);

    act(() => {
      mockRoom.localParticipant.tracks = new Map([[0, { trackName: 'screen' }]]);
      mockRoom.localParticipant.emit('trackPublished');
    });

    expect(result.current).toEqual(mockRoom.localParticipant);

    act(() => {
      mockRoom.localParticipant.tracks = new Map([]);
      mockRoom.localParticipant.emit('trackUnpublished');
    });

    expect(result.current).toEqual(undefined);
  });

  it('should respond to "trackPublished" and "trackUnpublished" events emitted from the room', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'screen' }]]),
    };
    mockUseVideoContext.mockImplementation(() => ({
      room: mockRoom,
      onError: () => {},
    }));

    const { result } = renderHook(useScreenShareParticipant);
    expect(result.current).toEqual(undefined);

    act(() => {
      mockRoom.participants = new Map([[0, mockParticipant]]);
      mockRoom.emit('trackPublished');
    });

    expect(result.current).toEqual(mockParticipant);

    act(() => {
      mockRoom.participants = new Map([]);
      mockRoom.emit('trackUnpublished');
    });

    expect(result.current).toEqual(undefined);
  });

  it('should respond to "participantDisconnected" events emitted from the room', () => {
    const mockRoom = MockRoom();
    const mockParticipant = {
      tracks: new Map([[0, { trackName: 'screen' }]]),
    };
    mockRoom.participants = new Map([[0, mockParticipant]]);

    mockUseVideoContext.mockImplementation(() => ({
      room: mockRoom,
    }));

    const { result } = renderHook(useScreenShareParticipant);
    expect(result.current).toEqual(mockParticipant);

    act(() => {
      mockRoom.participants = new Map();
      mockRoom.emit('participantDisconnected');
    });

    expect(result.current).toEqual(undefined);
  });

  it('should clean up all listeners when unmounted', () => {
    const mockRoom = MockRoom();

    mockUseVideoContext.mockImplementation(() => ({
      room: mockRoom,
      onError: () => {},
    }));

    const { unmount } = renderHook(useScreenShareParticipant);

    expect(mockRoom.listenerCount('trackPublished')).toBe(1);
    expect(mockRoom.listenerCount('trackUnpublished')).toBe(1);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(1);
    expect(mockRoom.localParticipant.listenerCount('trackPublished')).toBe(1);
    expect(mockRoom.localParticipant.listenerCount('trackUnpublished')).toBe(1);

    unmount();

    expect(mockRoom.listenerCount('trackPublished')).toBe(0);
    expect(mockRoom.listenerCount('trackUnpublished')).toBe(0);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(0);
    expect(mockRoom.localParticipant.listenerCount('trackPublished')).toBe(0);
    expect(mockRoom.localParticipant.listenerCount('trackUnpublished')).toBe(0);
  });
});
