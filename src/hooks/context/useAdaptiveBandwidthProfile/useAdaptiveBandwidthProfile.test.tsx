import useAdaptiveBandwidthProfile from './useAdaptiveBandwidthProfile';
import { useVideoContext } from '..';
import { renderHook, act } from '@testing-library/react-hooks';
import useScreenShareParticipant from '../../useScreenShareParticipant/useScreenShareParticipant';

jest.mock('..');
jest.mock('../../useScreenShareParticipant/useScreenShareParticipant');

const mockSetBandwidthProfile = jest.fn();
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;
mockUseVideoContext.mockImplementation(() => ({
  room: { localParticipant: { setBandwidthProfile: mockSetBandwidthProfile } },
}));

describe('the useAdaptiveBandwidthProfile hook', () => {
  beforeEach(jest.clearAllMocks);

  it('should correctly respond when screenShareParticipant changes', () => {
    mockUseScreenShareParticipant.mockImplementation(() => null);
    const { rerender } = renderHook(useAdaptiveBandwidthProfile);
    expect(mockSetBandwidthProfile).toHaveBeenCalledWith({
      video: { dominantSpeakerPriority: 'high', mode: 'collaboration' },
    });
    act(() => {
      mockUseScreenShareParticipant.mockImplementation(() => ({}));
    });
    rerender();
    expect(mockSetBandwidthProfile).toHaveBeenLastCalledWith({
      video: { dominantSpeakerPriority: 'low', mode: 'presentation' },
    });
  });
});
