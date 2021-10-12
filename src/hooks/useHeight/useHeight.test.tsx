import { act, renderHook } from '@testing-library/react-hooks';

import useHeight from './useHeight';

describe('the useHeight hook', () => {
  describe('device was rotated', () => {
    it('returns the updated height', () => {
      const mockScrollTo = jest.fn((x: number, y: number) => undefined);
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 500 });
      Object.defineProperty(window, 'scrollTo', { writable: true, value: mockScrollTo });
      Object.defineProperty(window, 'visualViewport', {
        writable: true,
        value: {
          height: 500,
          onresize: undefined,
          width: 400,
        },
      });

      const { result, rerender } = renderHook(useHeight);

      expect(result.current).toBe('500px');

      act(() => {
        Object.defineProperty(window, 'innerHeight', { writable: true, value: 400 });
        Object.defineProperty(window, 'visualViewport', {
          writable: true,
          value: {
            ...window.visualViewport,
            height: 400,
            width: 500,
          },
        });

        if (window.visualViewport.onresize) {
          window.visualViewport.onresize(new UIEvent('resize'));
        }
      });

      rerender();

      expect(result.current).toBe('400px');
      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('device was NOT rotated', () => {
    describe('NOT isMobile', () => {
      it('returns the current height', () => {
        const mockScrollTo = jest.fn((x: number, y: number) => undefined);
        Object.defineProperty(window, 'innerHeight', { writable: true, value: 500 });
        Object.defineProperty(window, 'scrollTo', { writable: true, value: mockScrollTo });
        Object.defineProperty(window, 'visualViewport', {
          writable: true,
          value: {
            height: 500,
            onresize: undefined,
            width: 400,
          },
        });

        const { result, rerender } = renderHook(useHeight);

        expect(result.current).toBe('500px');

        act(() => {
          if (window.visualViewport.onresize) {
            window.visualViewport.onresize(new UIEvent('resize'));
          }
        });

        rerender();

        expect(result.current).toBe('500px');
        expect(mockScrollTo).not.toHaveBeenCalledWith(0, 0);
      });
    });
  });

  it('should take window.visualViewport.scale into account', () => {
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 500 });
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      value: {
        height: 500,
        onresize: undefined,
        scale: 2,
        width: 400,
      },
    });

    const { result, rerender } = renderHook(useHeight);

    expect(result.current).toBe('1000px');

    act(() => {
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 750 });
      if (window.visualViewport.onresize) {
        window.visualViewport.onresize(new UIEvent('resize'));
      }
    });

    rerender();

    expect(result.current).toBe('1500px');
  });
});
