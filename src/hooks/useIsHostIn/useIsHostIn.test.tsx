import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useIsHostIn from './useIsHostIn';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../useVideoContext/useVideoContext');
jest.mock('../useDominantSpeaker/useDominantSpeaker');

const mockedVideoContext = useVideoContext as jest.Mock<any>;

describe('the useIsHostIn hook', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockRoom = new EventEmitter();
    mockedVideoContext.mockImplementation(() => ({
      room: mockRoom,
    }));
  });

  it('when there are no participants yet should return true', () => {
    const { result } = renderHook(useIsHostIn);
    expect(result.current).toEqual(true);
  });

  it('should return false when "participantConnected" is not the host', async () => {
    const { result } = renderHook(useIsHostIn);
    act(() => {
      mockRoom.emit('participantConnected', { identity: 'newParticipant@HearingOfficer' });
    });
    expect(result.current).toEqual(false);
  });

  it('should return true when "participantConnected" is the host', async () => {
    const { result } = renderHook(useIsHostIn);
    act(() => {
      mockRoom.emit('participantConnected', { identity: 'newParticipant@HearingOfficer' });
      mockRoom.emit('participantConnected', { identity: 'newParticipant@Reporter' });
    });
    expect(result.current).toEqual(true);
  });

  it('should return false after host had left', async () => {
    const { result } = renderHook(useIsHostIn);
    act(() => {
      mockRoom.emit('participantConnected', { identity: 'newParticipant@HearingOfficer' });
      mockRoom.emit('participantConnected', { identity: 'newParticipant@Reporter' });
      mockRoom.emit('participantDisconnected', { identity: 'newParticipant@Reporter' });
    });
    expect(result.current).toEqual(false);
  });

  it('should return true after host had left and there is another host in the room', async () => {
    const { result } = renderHook(useIsHostIn);
    act(() => {
      mockRoom.emit('participantConnected', { identity: 'newParticipant@HearingOfficer' });
      mockRoom.emit('participantConnected', { identity: 'newParticipant@Reporter' });
      mockRoom.emit('participantConnected', { identity: 'newParticipant1@Reporter' });
      mockRoom.emit('participantDisconnected', { identity: 'newParticipant@Reporter' });
    });
    expect(result.current).toEqual(true);
  });
});
