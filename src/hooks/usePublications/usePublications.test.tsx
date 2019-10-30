import { renderHook, act } from '@testing-library/react-hooks';
import usePublications from './usePublications';
import EventEmitter from 'events';

describe('the usePublications hook', () => {
  let mockParticipant: any;

  beforeEach(() => {
    mockParticipant = new EventEmitter();
    mockParticipant.tracks = new Map([[0, 'track1'], [1, 'track2']]);
  });

  it('should return an array of mockParticipant.tracks by default', () => {
    const { result } = renderHook(() => usePublications(mockParticipant));
    expect(result.current).toEqual(['track1', 'track2']);
  });

  it('should return respond to "trackPublished" events', async () => {
    const { result } = renderHook(() => usePublications(mockParticipant));
    act(() => {
      mockParticipant.emit('trackPublished', 'newMockTrack');
    });
    expect(result.current).toEqual(['track1', 'track2', 'newMockTrack']);
  });

  it('should return respond to "trackRemoved" events', async () => {
    const { result } = renderHook(() => usePublications(mockParticipant));
    act(() => {
      mockParticipant.emit('trackRemoved', 'track1');
    });
    expect(result.current).toEqual(['track2']);
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(() => usePublications(mockParticipant));
    unmount();
    expect(mockParticipant.listenerCount('trackPublished')).toBe(0);
    expect(mockParticipant.listenerCount('trackUnpublished')).toBe(0);
  });
});
