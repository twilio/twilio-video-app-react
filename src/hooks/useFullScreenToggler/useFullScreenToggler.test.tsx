import { act, renderHook } from '@testing-library/react-hooks';
import useFullScreenToggler from './useFullScreenToggler';
import fscreen from 'fscreen';

jest.mock('fscreen', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  exitFullscreen: jest.fn(),
  requestFullscreen: jest.fn(),
  fullscreenElement: null,
}));

describe('the useFullScreenToggler hook', () => {
  beforeEach(() => {
    // @ts-ignore readonly property
    fscreen.fullscreenElement = null;
    jest.clearAllMocks();
  });

  it('should return a binary array with a getter an the toggler', () => {
    const { result } = renderHook(useFullScreenToggler);
    expect(result.current).toEqual([expect.any(Boolean), expect.any(Function)]);
  });

  it('should request full screen when it gets toggled and it is not already in full screen', () => {
    const { result } = renderHook(useFullScreenToggler);
    let [isFullScreen, setFullScreen] = result.current;
    expect(isFullScreen).toBe(false);
    act(() => {
      setFullScreen();
    });
    expect(fscreen.requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should exit full screen when it gets toggled and it is activated', () => {
    // @ts-ignore readonly property
    fscreen.fullscreenElement = 'Something';

    const { result } = renderHook(useFullScreenToggler);
    let [isFullScreen, setFullScreen] = result.current;
    expect(isFullScreen).toBe(true);
    act(() => {
      setFullScreen();
    });
    expect(fscreen.exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should react to fullscreenchange event and update isFullScreen accordingly', async () => {
    const { result } = renderHook(useFullScreenToggler);
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
    const { unmount } = renderHook(useFullScreenToggler);
    expect(fscreen.addEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    unmount();
    expect(fscreen.removeEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
  });
});
