import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import { useAppState } from '../../state';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useGalleryViewParticipants from './useGalleryViewParticipants';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../../state');
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../useDominantSpeaker/useDominantSpeaker');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockVideoContext = useVideoContext as jest.Mock<any>;
const mockUseDominantSpeaker = useDominantSpeaker as jest.Mock<any>;

mockUseAppState.mockImplementation(() => ({ maxGalleryViewParticipants: 9 }));

describe('the useGalleryViewParticipants hook', () => {
  let mockRoom: any;

  beforeEach(() => {
    mockRoom = new EventEmitter();
    mockRoom.participants = new Map([
      [0, 'participant1'],
      [1, 'participant2'],
    ]);

    mockUseDominantSpeaker.mockImplementation(() => null);
    mockVideoContext.mockImplementation(() => ({ room: mockRoom }));
  });

  it('should return an array of mockParticipants by default', () => {
    const { result } = renderHook(() => useGalleryViewParticipants());
    expect(result.current).toEqual(['participant1', 'participant2']);
  });

  it('should handle "participantConnected" events', async () => {
    const { result } = renderHook(() => useGalleryViewParticipants());
    act(() => {
      mockRoom.emit('participantConnected', 'newParticipant');
    });
    expect(result.current).toEqual(['participant1', 'participant2', 'newParticipant']);
  });

  it('should handle "participantDisconnected" events', async () => {
    const { result } = renderHook(() => useGalleryViewParticipants());
    act(() => {
      mockRoom.emit('participantDisconnected', 'participant1');
    });
    expect(result.current).toEqual(['participant2']);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useGalleryViewParticipants());
    unmount();
    expect(mockRoom.listenerCount('participantConnected')).toBe(0);
    expect(mockRoom.listenerCount('participantDisconnected')).toBe(0);
  });

  describe('dominant speaker updates', () => {
    it('should return the connected participants when dominantSpeaker is not null, but not connected', () => {
      const mockParticipants = new Map([
        [0, 'participant1'],
        [1, 'participant3'],
      ]);

      mockRoom.participants = mockParticipants;
      const mockParticipantsArray = Array.from(mockParticipants.values());

      const { result, rerender } = renderHook(() => useGalleryViewParticipants());
      expect(result.current).toEqual(mockParticipantsArray);

      mockUseDominantSpeaker.mockImplementation(() => 'participant2');
      rerender();

      expect(result.current).toEqual(['participant1', 'participant3']);
    });

    it('should not reorder participants when there are less than maxGalleryViewParticipants and the dominant speaker changes', () => {
      const mockParticipants = new Map([
        [0, 'participant1'],
        [1, 'participant2'],
        [2, 'participant3'],
        [3, 'participant4'],
        [4, 'participant5'],
        [5, 'participant6'],
        [6, 'participant7'],
        [7, 'participant8'],
      ]);
      mockRoom.participants = mockParticipants;
      const mockParticipantsArray = Array.from(mockParticipants.values());

      const { result, rerender } = renderHook(() => useGalleryViewParticipants());
      expect(result.current).toEqual(mockParticipantsArray);

      mockUseDominantSpeaker.mockImplementation(() => 'participant9');
      rerender();

      expect(result.current).toEqual(mockParticipantsArray);
    });

    it('should replace the oldest onscreen dominant speaker with the new dominant speaker if they are offscreen', () => {
      const mockParticipants = new Map([
        [0, 'participant1'],
        [1, 'participant2'],
        [2, 'participant3'],
        [3, 'participant4'],
        [4, 'participant5'],
        [5, 'participant6'],
        [6, 'participant7'],
        [7, 'participant8'],
        [8, 'participant9'],
        [9, 'participant10'],
        [10, 'participant11'],
      ]);
      mockRoom.participants = mockParticipants;
      const mockParticipantsArray = Array.from(mockParticipants.values());

      const { result, rerender } = renderHook(() => useGalleryViewParticipants());
      expect(result.current).toEqual(mockParticipantsArray);

      // dominant speaker updates:
      mockUseDominantSpeaker.mockImplementation(() => 'participant8');
      rerender();
      mockUseDominantSpeaker.mockImplementation(() => 'participant7');
      rerender();
      mockUseDominantSpeaker.mockImplementation(() => 'participant6');
      rerender();
      mockUseDominantSpeaker.mockImplementation(() => 'participant11');
      rerender();

      expect(result.current).toEqual([
        'participant11',
        'participant2',
        'participant3',
        'participant4',
        'participant5',
        'participant6',
        'participant7',
        'participant8',
        'participant1',
        'participant9',
        'participant10',
      ]);

      // more dominant speaker updates:
      mockUseDominantSpeaker.mockImplementation(() => 'participant1');
      rerender();
      mockUseDominantSpeaker.mockImplementation(() => 'participant3');
      rerender();
      mockUseDominantSpeaker.mockImplementation(() => 'participant5');
      rerender();
      mockUseDominantSpeaker.mockImplementation(() => 'participant10');
      rerender();

      expect(result.current).toEqual([
        'participant11',
        'participant1',
        'participant3',
        'participant10',
        'participant5',
        'participant6',
        'participant7',
        'participant8',
        'participant4',
        'participant2',
        'participant9',
      ]);
    });

    describe('when isMobileGalleryViewActive is true', () => {
      it('should not reorder participants when there are less than 6 remoteParticipants, and the dominant speaker changes', () => {
        const mockParticipants = new Map([
          [0, 'participant1'],
          [1, 'participant2'],
          [2, 'participant3'],
          [3, 'participant4'],
          [4, 'participant5'],
        ]);
        mockRoom.participants = mockParticipants;
        const mockParticipantsArray = Array.from(mockParticipants.values());

        const { result, rerender } = renderHook(() => useGalleryViewParticipants(true));
        expect(result.current).toEqual(mockParticipantsArray);

        mockUseDominantSpeaker.mockImplementation(() => 'participant3');
        rerender();

        expect(result.current).toEqual(mockParticipantsArray);
      });

      it('should replace the oldest dominantSpeaker with the newest if newest is not on page 1 & make the oldest the 6th remoteParticipant', () => {
        const mockParticipants = new Map([
          [0, 'participant1'],
          [1, 'participant2'],
          [2, 'participant3'],
          [3, 'participant4'],
          [4, 'participant5'],
          [5, 'participant6'],
          [6, 'participant7'],
          [7, 'participant8'],
          [8, 'participant9'],
        ]);
        mockRoom.participants = mockParticipants;
        const mockParticipantsArray = Array.from(mockParticipants.values());

        const { result, rerender } = renderHook(() => useGalleryViewParticipants(true));
        expect(result.current).toEqual(mockParticipantsArray);

        // dominant speaker updates:
        mockUseDominantSpeaker.mockImplementation(() => 'participant1');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant3');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant5');
        rerender();
        mockUseDominantSpeaker.mockImplementation(() => 'participant9');
        rerender();

        expect(result.current).toEqual([
          'participant1',
          'participant9',
          'participant3',
          'participant4',
          'participant5',
          'participant2',
          'participant6',
          'participant7',
          'participant8',
        ]);
      });
    });
  });
});
