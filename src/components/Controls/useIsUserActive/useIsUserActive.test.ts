import { act, renderHook } from '@testing-library/react-hooks';
import useIsUserActive from './useIsUserActive';

jest.mock('lodash.throttle', () => (fn: Function) => fn);
jest.useFakeTimers();

describe('the useIsUserActive hook', () => {
  afterEach(jest.clearAllTimers);

  it('should return true initially, then return false after a delay', () => {
    const { result } = renderHook(useIsUserActive);
    expect(result.current).toBe(true);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(result.current).toBe(false);
  });

  it('should respond to mousemove events', () => {
    const { result } = renderHook(useIsUserActive);
    act(() => {
      jest.runOnlyPendingTimers();
      window.dispatchEvent(new Event('mousemove'));
    });
    expect(result.current).toBe(true);
  });

  it('should respond to click events', () => {
    const { result } = renderHook(useIsUserActive);
    act(() => {
      jest.runOnlyPendingTimers();
      window.dispatchEvent(new Event('click'));
    });
    expect(result.current).toBe(true);
  });

  it('should respond to keydown events', () => {
    const { result } = renderHook(useIsUserActive);
    act(() => {
      jest.runOnlyPendingTimers();
      window.dispatchEvent(new Event('keydown'));
    });
    expect(result.current).toBe(true);
  });
});
