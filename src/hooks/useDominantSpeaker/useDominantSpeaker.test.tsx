import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import useDominantSpeaker from './useDominantSpeaker';
import { useVideoContext } from '../context';

jest.mock('../context');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the useDominantSpeaker hook', () => {
  const mockRoom: any = new EventEmitter();
  mockRoom.dominantSpeaker = 'mockDominantSpeaker';
  mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));

  it('should return room.dominantSpeaker by default', () => {
    const { result } = renderHook(useDominantSpeaker);
    expect(result.current).toBe('mockDominantSpeaker');
  });

  it('should return respond to "dominantSpeakerChanged" events', async () => {
    const { result } = renderHook(useDominantSpeaker);
    act(() => {
      mockRoom.emit('dominantSpeakerChanged', 'newDominantSpeaker');
    });
    expect(result.current).toBe('newDominantSpeaker');
  });

  it('should clean up listeners on unmount', () => {
    const { unmount } = renderHook(useDominantSpeaker);
    unmount();
    expect(mockRoom.listenerCount('dominantSpeakerChanged')).toBe(0);
  });
});
