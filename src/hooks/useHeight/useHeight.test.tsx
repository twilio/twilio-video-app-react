import { act, renderHook } from '@testing-library/react-hooks';

import useHeight from './useHeight';

describe('the useHeight hook', () => {
  it('should return window.innerHeight', () => {
    // @ts-ignore
    window.innerHeight = 100;
    const { result } = renderHook(useHeight);
    expect(result.current).toBe('100px');

    act(() => {
      // @ts-ignore
      window.innerHeight = 150;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('150px');
  });

  it('should take window.visualViewport.scale into account', () => {
    // @ts-ignore
    window.innerHeight = 100;

    // @ts-ignore
    window.visualViewport = {
      scale: 2,
    };

    const { result } = renderHook(useHeight);
    expect(result.current).toBe('200px');

    act(() => {
      // @ts-ignore
      window.innerHeight = 150;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('300px');
  });
});
