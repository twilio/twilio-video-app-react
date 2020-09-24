import { act, renderHook } from '@testing-library/react-hooks';
import * as deviceHooks from './deviceHooks';

let mockDevices = [{ deviceId: 1, label: '1' }];
let mockAddEventListener = jest.fn();
let mockRemoveEventListener = jest.fn();

// @ts-ignore
navigator.mediaDevices = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
};

describe('the useDevices hook', () => {
  afterEach(jest.clearAllMocks);

  it('should correctly return a list of devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useDevices);
    await waitForNextUpdate();
    expect(result.current).toEqual(mockDevices);
  });

  it('should respond to "devicechange" events', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useDevices);
    await waitForNextUpdate();
    expect(mockAddEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
    act(() => {
      // @ts-ignore
      navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ deviceId: 2, label: '2' }]);
      mockAddEventListener.mock.calls[0][1]();
    });
    await waitForNextUpdate();
    expect(result.current).toEqual([{ deviceId: 2, label: '2' }]);
  });
});
