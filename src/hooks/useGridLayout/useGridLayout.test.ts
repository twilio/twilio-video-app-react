import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useGridLayout, { layoutIsTooSmall } from './useGridLayout';

describe('the layoutIsTooSmall function', () => {
  it('should return false if the grid is taller than the height of the app container', () => {
    expect(layoutIsTooSmall(989, 3, 1280, 720)).toBe(false);
  });

  it('should return true if the grid is not taller than the app container', () => {
    expect(layoutIsTooSmall(418, 2, 1280, 720)).toBe(true);
  });
});

const mockContainerEl = { offsetHeight: 720, offsetWidth: 1280 };

jest.spyOn(React, 'useRef').mockReturnValue({
  current: mockContainerEl,
});

describe('the useGridLayout hook', () => {
  beforeEach(() => {
    // set the default offsetHeight and offsetWidth of the app's container:
    mockContainerEl.offsetHeight = 720;
    mockContainerEl.offsetWidth = 1280;
  });

  const testInputs = [
    { participants: 1, expectedWidth: 1263 },
    { participants: 2, expectedWidth: 631 },
    { participants: 3, expectedWidth: 628 },
    { participants: 4, expectedWidth: 628 },
    { participants: 5, expectedWidth: 418 },
    { participants: 6, expectedWidth: 418 },
    { participants: 7, expectedWidth: 417 },
    { participants: 8, expectedWidth: 417 },
    { participants: 9, expectedWidth: 417 },
  ];

  testInputs.forEach(test => {
    it(`should return a participantVideoWidth of ${test.expectedWidth} when rendering ${test.participants} participant(s)`, () => {
      const { result } = renderHook(() => useGridLayout(test.participants, false));
      expect(result.current.participantVideoWidth).toBe(test.expectedWidth);
    });
  });

  it('should return 0 when the containerRef is null', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: null,
    });
    const { result } = renderHook(() => useGridLayout(3, false));
    expect(result.current.participantVideoWidth).toBe(0);
  });

  it('should rerender when isPresentationModeActive changes', () => {
    const { result, rerender } = renderHook(
      ({ participants, isPresentationModeActive }) => useGridLayout(participants, isPresentationModeActive),
      { initialProps: { participants: 3, isPresentationModeActive: false } }
    );
    expect(result.current.participantVideoWidth).toBe(628);

    mockContainerEl.offsetWidth = 128;
    rerender({ participants: 3, isPresentationModeActive: true });

    expect(result.current.participantVideoWidth).toBe(116);
  });
});
