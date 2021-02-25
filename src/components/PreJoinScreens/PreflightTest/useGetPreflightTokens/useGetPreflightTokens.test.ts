import { renderHook } from '@testing-library/react-hooks';
import { useAppState } from '../../../../state';
import useGetPreflightTokens from './useGetPreflightTokens';

jest.mock('../../../../state');
const mockUseAppState = useAppState as jest.Mock<any>;

const mockGetToken = jest.fn(() => Promise.resolve('mockToken'));
mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken }));

describe('the useGetPreflightTokens hook', () => {
  it('should return two tokens', async () => {
    const { result, waitForNextUpdate } = renderHook(useGetPreflightTokens);
    await waitForNextUpdate();
    expect(result.current).toEqual({ tokens: ['mockToken', 'mockToken'], tokenError: undefined });
  });

  it('should ignore a rerender that occurs before the tokens have been fetched', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(useGetPreflightTokens);
    rerender();
    await waitForNextUpdate();
    expect(result.current).toEqual({ tokens: ['mockToken', 'mockToken'], tokenError: undefined });
  });

  it('should return the tokenError property when there is an error', async () => {
    const mockGetTokenFn = jest.fn(() => Promise.reject('mockError'));
    mockUseAppState.mockImplementationOnce(() => ({ getToken: mockGetTokenFn }));
    const { result, waitForNextUpdate } = renderHook(useGetPreflightTokens);
    await waitForNextUpdate();
    expect(result.current).toEqual({ tokens: undefined, tokenError: 'mockError' });
  });
});
