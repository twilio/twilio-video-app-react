import { act, renderHook } from '@testing-library/react-hooks';
import useFullScreenToggle from './useFullScreenToggle';
import fscreen from 'fscreen';

jest.mock('fscreen', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  exitFullscreen: jest.fn(),
  requestFullscreen: jest.fn(),
  fullscreenElement: null,
}));

describe('the useFullScreenToggle hook', () => {
  beforeEach(() => {
    // @ts-ignore readonly property
    fscreen.fullscreenElement = null;
    jest.clearAllMocks();
  });

  it('should return an array with a boolean and a toggle function', () => {
    const { result } = renderHook(useFullScreenToggle);
    expect(result.current).toEqual([expect.any(Boolean), expect.any(Function)]);
  });

  it('should request full screen when it is toggled and it is not already in full screen', () => {
    const { result } = renderHook(useFullScreenToggle);
    let [isFullScreen, setFullScreen] = result.current;
    expect(isFullScreen).toBe(false);
    act(() => {
      setFullScreen();
    });
    expect(fscreen.requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should exit full screen when it is toggled and it is already in full screen', () => {
    // @ts-ignore readonly property
    fscreen.fullscreenElement = 'Something';

    const { result } = renderHook(useFullScreenToggle);
    let [isFullScreen, setFullScreen] = result.current;
    expect(isFullScreen).toBe(true);
    act(() => {
      setFullScreen();
    });
    expect(fscreen.exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should react to fullscreenchange event and update isFullScreen accordingly', async () => {
    const { result } = renderHook(useFullScreenToggle);
    expect(fscreen.addEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    const mockSetIsFullscreen = (fscreen.addEventListener as jest.Mock<any>).mock.calls[0][1];

    act(() => {
      // @ts-ignore readonly property
      fscreen.fullscreenElement = true;
      mockSetIsFullscreen();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      // @ts-ignore readonly property
      fscreen.fullscreenElement = false;
      mockSetIsFullscreen();
    });

    expect(result.current[0]).toBe(false);
  });

  it('should remove listeners on unmount', () => {
    const { unmount } = renderHook(useFullScreenToggle);
    expect(fscreen.addEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    unmount();
    expect(fscreen.removeEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
  });
});
