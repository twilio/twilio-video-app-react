import { act, renderHook } from '@testing-library/react-hooks';
import useFullScreenToggler from './useFullScreenToggler';
import fscreen from 'fscreen';

jest.mock('fscreen', () => {
  const {
    default: { addEventListener, removeEventListener },
  } = jest.requireActual('fscreen');
  return {
    addEventListener,
    removeEventListener,
    exitFullscreen: jest.fn(),
    requestFullscreen: jest.fn(),
  };
});

const dispatchFullScreenChangeEvent = (fullscreenElement: string | null) => {
  // @ts-ignore readonly property
  fscreen.fullscreenElement = fullscreenElement;
  const enterFullScreenEvent = new CustomEvent('fullscreenchange', { bubbles: true });
  document.dispatchEvent(enterFullScreenEvent);
};

describe('the useFullScreenToggler hook', () => {
  beforeEach(() => {
    // @ts-ignore readonly property
    fscreen.fullscreenElement = null;
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

    act(() => {
      dispatchFullScreenChangeEvent('element');
    });

    let [isFullScreen] = result.current;
    expect(isFullScreen).toBe(true);

    act(() => {
      dispatchFullScreenChangeEvent(null);
    });

    [isFullScreen] = result.current;
    expect(isFullScreen).toBe(false);
  });
});
