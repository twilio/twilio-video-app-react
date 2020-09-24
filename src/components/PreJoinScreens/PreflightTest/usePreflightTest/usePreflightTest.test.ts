import { act, renderHook } from '@testing-library/react-hooks';
import { mockPreflightTest } from '../../../../__mocks__/twilio-video';
import usePreflightTest from './usePreflightTest';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../../hooks/useVideoContext/useVideoContext');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

mockUseVideoContext.mockImplementation(() => ({
  isConnecting: false,
}));

describe('the usePreflightTest hook', () => {
  beforeEach(jest.clearAllMocks);

  it('should return a testReport when the test succeeds', () => {
    const { result } = renderHook(() => usePreflightTest('tokenA', 'tokenB'));
    act(() => {
      mockPreflightTest.emit('completed', 'mockReport');
    });
    expect(result.current.testReport).toBe('mockReport');
    expect(result.current.testFailure).toBe(undefined);
  });

  it('should set isTestRunning to true when the test is running', () => {
    const { result } = renderHook(() => usePreflightTest('tokenA', 'tokenB'));
    expect(result.current.isTestRunning).toBe(true);
    act(() => {
      mockPreflightTest.emit('completed', 'mockReport');
    });
    expect(result.current.isTestRunning).toBe(false);
  });

  it('should ignore a rerender when the test is in progress', () => {
    const { result, rerender } = renderHook(() => usePreflightTest('tokenA', 'tokenB'));
    rerender();
    act(() => {
      mockPreflightTest.emit('completed', 'mockReport');
    });
    expect(result.current.testReport).toBe('mockReport');
  });

  it('should return a testFailure when there is an error', () => {
    const { result } = renderHook(() => usePreflightTest('tokenA', 'tokenB'));
    expect(result.current.isTestRunning).toBe(true);
    act(() => {
      mockPreflightTest.emit('failed', 'mockError');
    });
    expect(result.current.isTestRunning).toBe(false);
    expect(result.current.testReport).toBe(undefined);
    expect(result.current.testFailure).toBe('mockError');
  });

  it('should stop the test when the hook is unmounted', () => {
    const { unmount } = renderHook(() => usePreflightTest('tokenA', 'tokenB'));

    act(() => {
      mockPreflightTest.emit('completed', 'mockReport');
    });

    unmount();

    expect(mockPreflightTest.stop).toHaveBeenCalled();
    expect(mockPreflightTest.listenerCount('completed')).toBe(0);
    expect(mockPreflightTest.listenerCount('failed')).toBe(0);
  });

  it('should stop the test when connecting to a room', () => {
    const { rerender } = renderHook(() => usePreflightTest('tokenA', 'tokenB'));

    act(() => {
      mockPreflightTest.emit('completed', 'mockReport');
    });

    mockUseVideoContext.mockImplementationOnce(() => ({
      isConnecting: true,
    }));

    rerender();

    expect(mockPreflightTest.stop).toHaveBeenCalled();
    expect(mockPreflightTest.listenerCount('completed')).toBe(0);
    expect(mockPreflightTest.listenerCount('failed')).toBe(0);
  });
});
