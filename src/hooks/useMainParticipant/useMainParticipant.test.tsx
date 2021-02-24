import { EventEmitter } from 'events';
import { renderHook } from '@testing-library/react-hooks';
import useMainParticipant from './useMainParticipant';
import useSelectedParticipant from '../../components/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useVideoContext from '../useVideoContext/useVideoContext';
import useScreenShareParticipant from '../useScreenShareParticipant/useScreenShareParticipant';

jest.mock('../useVideoContext/useVideoContext');
jest.mock('../../components/VideoProvider/useSelectedParticipant/useSelectedParticipant');
jest.mock('../useScreenShareParticipant/useScreenShareParticipant');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockSelectedParticipant = useSelectedParticipant as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;

describe('the useMainParticipant hook', () => {
  beforeEach(() => {
    mockSelectedParticipant.mockImplementation(() => [null]);
    mockUseScreenShareParticipant.mockImplementation(() => undefined);
  });

  it('should return the dominant speaker if it exists', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.dominantSpeaker = 'dominantSpeaker';
    mockRoom.participants = new Map([[0, 'participant']]) as any;
    mockRoom.localParticipant = 'localParticipant';
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const { result } = renderHook(useMainParticipant);
    expect(result.current).toBe('dominantSpeaker');
  });

  it('should return the first remote participant if it exists', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.dominantSpeaker = null;
    mockRoom.participants = new Map([
      [0, 'participant'],
      [1, 'secondParticipant'],
    ]) as any;
    mockRoom.localParticipant = 'localParticipant';
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const { result } = renderHook(useMainParticipant);
    expect(result.current).toBe('participant');
  });

  it('should return the local participant if it exists', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.dominantSpeaker = null;
    mockRoom.participants = new Map() as any;
    mockRoom.localParticipant = 'localParticipant';
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const { result } = renderHook(useMainParticipant);
    expect(result.current).toBe('localParticipant');
  });

  it('should return the selected participant if it exists', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.dominantSpeaker = 'dominantSpeaker';
    mockRoom.participants = new Map([[0, 'participant']]) as any;
    mockRoom.localParticipant = 'localParticipant';
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
    mockSelectedParticipant.mockImplementation(() => ['mockSelectedParticipant']);
    const { result } = renderHook(useMainParticipant);
    expect(result.current).toBe('mockSelectedParticipant');
  });

  it('should return the screen share participant if it exists', () => {
    mockUseScreenShareParticipant.mockImplementation(() => 'mockScreenShareParticipant');
    const mockRoom: any = new EventEmitter();
    mockRoom.dominantSpeaker = 'dominantSpeaker';
    mockRoom.participants = new Map([[0, 'participant']]) as any;
    mockRoom.localParticipant = 'localParticipant';
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const { result } = renderHook(useMainParticipant);
    expect(result.current).toBe('mockScreenShareParticipant');
  });
});
