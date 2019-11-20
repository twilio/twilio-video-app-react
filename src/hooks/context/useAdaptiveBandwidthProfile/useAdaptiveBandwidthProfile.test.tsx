import useAdaptiveBandwidthProfile from './useAdaptiveBandwidthProfile';
import { useVideoContext } from '..';
import { renderHook, act } from '@testing-library/react-hooks';
import useScreenShareParticipant from '../../useScreenShareParticipant/useScreenShareParticipant';

jest.mock('..');
jest.mock('../../useScreenShareParticipant/useScreenShareParticipant');

const mockSetBandwidthProfile = jest.fn();
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock<any>;
const mockLocalParticipant = { setBandwidthProfile: mockSetBandwidthProfile };
mockUseVideoContext.mockImplementation(() => ({
  room: { localParticipant: mockLocalParticipant },
}));

describe('the useAdaptiveBandwidthProfile hook', () => {
  beforeEach(jest.clearAllMocks);

  it('should should set the bandwidthProfile to "presentation" when there is a remoteParticipant sharing their screen', () => {
    mockUseScreenShareParticipant.mockImplementation(() => ({}));
    renderHook(useAdaptiveBandwidthProfile);
    expect(mockSetBandwidthProfile).toHaveBeenCalledWith({
      video: { mode: 'presentation' },
    });
  });

  it('should should set the bandwidthProfile to "collaboration" when there is no remoteParticipant sharing their screen', () => {
    mockUseScreenShareParticipant.mockImplementation(() => null);
    renderHook(useAdaptiveBandwidthProfile);
    expect(mockSetBandwidthProfile).toHaveBeenCalledWith({
      video: { mode: 'collaboration' },
    });
  });

  it('should should set the bandwidthProfile to "collaboration" when the localParticipant is sharing their screen', () => {
    mockUseScreenShareParticipant.mockImplementation(() => mockLocalParticipant);
    renderHook(useAdaptiveBandwidthProfile);
    expect(mockSetBandwidthProfile).toHaveBeenCalledWith({
      video: { mode: 'collaboration' },
    });
  });

  it('should update when screenShareParticipant changes', () => {
    mockUseScreenShareParticipant.mockImplementation(() => null);
    const { rerender } = renderHook(useAdaptiveBandwidthProfile);
    expect(mockSetBandwidthProfile).toHaveBeenCalledWith({
      video: { mode: 'collaboration' },
    });
    act(() => {
      mockUseScreenShareParticipant.mockImplementation(() => ({}));
    });
    rerender();
    expect(mockSetBandwidthProfile).toHaveBeenCalledWith({
      video: { mode: 'presentation' },
    });
  });
});
