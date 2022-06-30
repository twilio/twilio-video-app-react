import { act, HookResult, renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import { Participant, Room } from 'twilio-video';
import useSelectedParticipant, { SelectedParticipantProvider } from './useSelectedParticipant';
import { useAppState } from '../../../state';

jest.mock('../../../state');

const mockUseAppState = useAppState as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ isGalleryViewActive: false }));

describe('the useSelectedParticipant hook', () => {
  let mockRoom: Room;
  let result: HookResult<readonly [Participant | null, (participant: Participant) => void]>;

  beforeEach(() => (mockRoom = new EventEmitter() as Room));

  beforeEach(() => {
    ({ result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider room={mockRoom}>{children}</SelectedParticipantProvider>,
    }));
  });

  it('should return null as the default value', () => {
    expect(result.current[0]).toBe(null);
  });

  it('should set a selected participant', () => {
    act(() => result.current[1]('mockParticipant' as any));
    expect(result.current[0]).toBe('mockParticipant');
  });

  it('should set "null" as the selected participant when the user selects the currently selected participant', () => {
    act(() => result.current[1]('mockParticipant' as any));
    act(() => result.current[1]('mockParticipant' as any));

    expect(result.current[0]).toBe(null);
  });

  it('should set "null" as the selected participant on room disconnect', () => {
    act(() => result.current[1]('mockParticipant' as any));
    expect(result.current[0]).toBe('mockParticipant');
    act(() => {
      mockRoom.emit('disconnected');
    });
    expect(result.current[0]).toBe(null);
  });

  it('should set "null" as the selected participant when the participant disconnects from the room', () => {
    act(() => result.current[1]('mockParticipant' as any));
    act(() => {
      mockRoom.emit('participantDisconnected', 'mockParticipant');
    });
    expect(result.current[0]).toBe(null);
  });

  it('should not set "null" as the selected participant when a non-selected participant disconnects from the room', () => {
    act(() => result.current[1]('mockParticipant' as any));
    act(() => {
      mockRoom.emit('participantDisconnected', 'otherMockParticipant');
    });
    expect(result.current[0]).toBe('mockParticipant');
  });

  it('should set "null" as the selected participant when gallery view is active', () => {
    act(() => result.current[1]('mockParticipant' as any));
    expect(result.current[0]).toBe('mockParticipant');

    mockUseAppState.mockImplementationOnce(() => ({ isGalleryViewActive: true }));
    act(() => result.current[1]('mockParticipant' as any));

    expect(result.current[0]).toBe(null);
  });
});
