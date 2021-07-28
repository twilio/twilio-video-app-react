import { useQuery } from './useQuery';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-router', () => ({
  useLocation: () => ({ search: '?test=123&foo=bar' }),
}));

describe('the useQuery hook', () => {
  it('should return a URLSearchParams object from the useLocation hook', () => {
    const { result } = renderHook(useQuery);
    expect(result.current.get('test')).toBe('123');
    expect(result.current.get('foo')).toBe('bar');
  });
});
