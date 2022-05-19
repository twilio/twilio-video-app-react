import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useCollaborationParticipants from './useParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../useVideoContext/useVideoContext');
jest.mock('../useDominantSpeaker/useDominantSpeaker');

const mockedVideoContext = useVideoContext as jest.Mock<any>;

describe('the useParticipants hook', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockRoom = new EventEmitter();
    mockRoom.participants = new Map([
      [0, 'participant1'],
      [1, 'participant2'],
    ]);
    mockedVideoContext.mockImplementation(() => ({
      room: mockRoom,
    }));
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const { result } = renderHook(useCollaborationParticipants);
    expect(result.current).toEqual(['participant1', 'participant2']);
  });

  it('should return respond to "participantConnected" events', async () => {
    const { result } = renderHook(useCollaborationParticipants);
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant');
    });
    expect(result.current).toEqual(['participant1', 'participant2', 'newParticipant']);
  });

  it('should return respond to "participantDisconnected" events', async () => {
    const { result } = renderHook(useCollaborationParticipants);
    act(() => {
      mockRoom.emit('participantDisconnected', 'participant1');
    });
    expect(result.current).toEqual(['participant2']);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(useCollaborationParticipants);
    unmount();
    expect(mockRoom.listenerCount('participantConnected')).toBe(0);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(0);
  });
});
