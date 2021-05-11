import { renderHook } from '@testing-library/react-hooks';
import useRestartAudioTrackOnDeviceChange from './useRestartAudioTrackOnDeviceChange';

let mockAddEventListener = jest.fn();
let mockRemoveEventListener = jest.fn();

// @ts-ignore
navigator.mediaDevices = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
};

describe('the useHandleTrackPublicationFailed hook', () => {
  afterEach(jest.clearAllMocks);

  it('should not restart the audio track if mediaStreamTrack readyState has not ended', () => {
    const localTrack = [{ kind: 'audio', mediaStreamTrack: { readyState: 'live' }, restart: jest.fn() }];
    renderHook(() => useRestartAudioTrackOnDeviceChange(localTrack as any));

    // call handleDeviceChange function:
    mockAddEventListener.mock.calls[0][1]();

    expect(localTrack[0].restart).not.toHaveBeenCalled();
  });

  it('should restart the audio track if mediaStreamTrack readyState has ended', () => {
    const localTrack = [{ kind: 'audio', mediaStreamTrack: { readyState: 'ended' }, restart: jest.fn() }];
    renderHook(() => useRestartAudioTrackOnDeviceChange(localTrack as any));

    // call handleDeviceChange function:
    mockAddEventListener.mock.calls[0][1]();

    expect(localTrack[0].restart).toHaveBeenCalledWith({});
  });

  it('should remove the event handler when component unmounts', () => {
    const { unmount } = renderHook(() => useRestartAudioTrackOnDeviceChange([]));
    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
  });
});
