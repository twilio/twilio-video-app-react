import { renderHook, act } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useTracks from './useTracks';

describe('the useTracks hook', () => {
  let mockParticipant: any;

  beforeEach(() => {
    mockParticipant = new EventEmitter();
    mockParticipant.tracks = new Map([
      [0, { track: 'track1' }],
      [1, { track: null }],
      [2, { track: 'track2' }],
    ]);
  });

  it('should return an array of mockParticipant.tracks by default, filtering out null tracks', () => {
    const { result } = renderHook(() => useTracks(mockParticipant));
    expect(result.current).toEqual(['track1', 'track2']);
  });

  it('should respond to "trackSubscribed" events', async () => {
    const { result } = renderHook(() => useTracks(mockParticipant));
    act(() => {
      mockParticipant.emit('trackSubscribed', 'newMockTrack');
    });
    expect(result.current).toEqual(['track1', 'track2', 'newMockTrack']);
  });

  it('should respond to "trackUnsubscribed" events', async () => {
    const { result } = renderHook(() => useTracks(mockParticipant));
    act(() => {
      mockParticipant.emit('trackUnsubscribed', 'track1');
    });
    expect(result.current).toEqual(['track2']);
  });

  it('should return a new set of tracks if the participant changes', () => {
    const { result, rerender } = renderHook(({ participant }) => useTracks(participant), {
      initialProps: { participant: mockParticipant },
    });
    expect(result.current).toEqual(['track1', 'track2']);
    mockParticipant = new EventEmitter();
    mockParticipant.tracks = new Map([
      [0, { track: 'track3' }],
      [1, { track: 'track4' }],
    ]);
    rerender({ participant: mockParticipant });
    expect(result.current).toEqual(['track3', 'track4']);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => useTracks(mockParticipant));
    unmount();
    expect(mockParticipant.listenerCount('trackSubscribed')).toBe(0);
    expect(mockParticipant.listenerCount('trackUnsubscribed')).toBe(0);
  });
});
