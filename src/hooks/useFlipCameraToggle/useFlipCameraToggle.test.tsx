import { renderHook } from '@testing-library/react-hooks';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../constants';
import useDevices from '../useDevices/useDevices';
import useFlipCameraToggle from './useFlipCameraToggle';
import useVideoContext from '../useVideoContext/useVideoContext';

jest.mock('../useMediaStreamTrack/useMediaStreamTrack');
jest.mock('../useVideoContext/useVideoContext');
jest.mock('../useDevices/useDevices');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseDevices = useDevices as jest.Mock<any>;

const mockStreamSettings = { facingMode: 'user' };

const mockVideoTrack = {
  name: '',
  kind: 'video',
  mediaStreamTrack: {
    getSettings: () => mockStreamSettings,
  },
  restart: jest.fn(),
};

const mockVideoContext = {
  localTracks: [mockVideoTrack],
  getLocalVideoTrack: jest.fn(() => Promise.resolve('newMockTrack')),
};

describe('the useFlipCameraToggle hook', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    mockUseDevices.mockImplementation(() => ({ videoInputDevices: ['mockCamera1', 'mockCamera2'] }));
  });

  it('should return flipCameraSupported: true, when a videoTrack exists and facingMode is supported', () => {
    mockUseVideoContext.mockImplementation(() => mockVideoContext);
    const { result } = renderHook(useFlipCameraToggle);
    expect(result.current).toEqual({
      flipCameraDisabled: false,
      toggleFacingMode: expect.any(Function),
      flipCameraSupported: true,
    });
  });

  it('should return flipCameraSupported: false, when a videoTrack exists and facingMode is not supported', () => {
    mockUseVideoContext.mockImplementation(() => ({
      ...mockVideoContext,
      localTracks: [
        {
          ...mockVideoTrack,
          mediaStreamTrack: {
            getSettings: () => ({}),
          },
        },
      ],
    }));
    const { result } = renderHook(useFlipCameraToggle);
    expect(result.current).toEqual({
      flipCameraDisabled: false,
      toggleFacingMode: expect.any(Function),
      flipCameraSupported: false,
    });
  });

  it('should return flipCameraSupported: false, and flipCameraDisabled: true, when no video track is present', () => {
    mockUseVideoContext.mockImplementation(() => ({
      ...mockVideoContext,
      localTracks: [],
    }));
    const { result } = renderHook(useFlipCameraToggle);
    expect(result.current).toEqual({
      flipCameraDisabled: true,
      toggleFacingMode: expect.any(Function),
      flipCameraSupported: false,
    });
  });

  it('should return flipCameraSupported: false, when there are less than two video input devices', () => {
    mockUseVideoContext.mockImplementation(() => mockVideoContext);
    mockUseDevices.mockImplementation(() => ({ videoInputDevices: ['mockCamera1'] }));
    const { result } = renderHook(useFlipCameraToggle);
    expect(result.current).toEqual({
      flipCameraDisabled: false,
      toggleFacingMode: expect.any(Function),
      flipCameraSupported: false,
    });
  });

  it('should call track.replace() with the correct facing mode when useFlipCameraToggle has been called', async () => {
    mockUseVideoContext.mockImplementation(() => ({
      ...mockVideoContext,
      localTracks: [
        {
          ...mockVideoTrack,
          mediaStreamTrack: {
            getSettings: () => ({ facingMode: 'environment' }),
          },
        },
      ],
    }));
    const { result } = renderHook(useFlipCameraToggle);
    result.current.toggleFacingMode();
    expect(mockVideoTrack.restart).toHaveBeenCalledWith({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      facingMode: 'user',
    });
  });
});
