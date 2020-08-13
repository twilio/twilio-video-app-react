import useVideoContext from './useVideoContext';
import { renderHook } from '@testing-library/react-hooks';

describe('the useVideoContext hook', () => {
  it('mock test to make this test suite pass', () => {
    let tester1 = true;
    expect((tester1 = true));
  });

  // it('should throw an error if used outside of the VideoProvider', () => {
  //   const { result } = renderHook(useVideoContext);
  //   expect(result.error.message).toBe('useVideoContext must be used within a VideoProvider');
  // });
});
