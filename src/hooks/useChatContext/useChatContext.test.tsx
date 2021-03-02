import useChatContext from './useChatContext';
import { renderHook } from '@testing-library/react-hooks';

describe('the useChatContext hook', () => {
  it('should throw an error if used outside of the ChatProvider', () => {
    const { result } = renderHook(useChatContext);
    expect(result.error.message).toBe('useChatContext must be used within a ChatProvider');
  });
});
