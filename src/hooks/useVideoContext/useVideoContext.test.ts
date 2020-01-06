import useVideoContext from './useVideoContext';
import { renderHook } from '@testing-library/react-hooks';

describe('the useVideoContext hook', () => {
  it('should throw an error if used outside of the VideoProvider', () => {
    const { result } = renderHook(useVideoContext);
    expect(result.error.message).toBe('useVideoContext must be used within a VideoProvider');
  });
});
