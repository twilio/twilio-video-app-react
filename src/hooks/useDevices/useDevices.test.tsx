import { act, renderHook } from '@testing-library/react-hooks';
import { getDeviceInfo } from '../../utils';
import useDevices from './useDevices';

jest.mock('../../utils', () => ({ getDeviceInfo: jest.fn(() => Promise.resolve()) }));

let mockAddEventListener = jest.fn();
let mockRemoveEventListener = jest.fn();

// @ts-ignore
navigator.mediaDevices = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
};

describe('the useDevices hook', () => {
  afterEach(jest.clearAllMocks);

  it('should return the correct default values', async () => {
    const { result, waitForNextUpdate } = renderHook(useDevices);
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "audioInputDevices": Array [],
        "audioOutputDevices": Array [],
        "hasAudioInputDevices": false,
        "hasVideoInputDevices": false,
        "videoInputDevices": Array [],
      }
    `);

    await waitForNextUpdate();
  });

  it('should respond to "devicechange" events', async () => {
    const { waitForNextUpdate } = renderHook(useDevices);
    expect(getDeviceInfo).toHaveBeenCalledTimes(1);

    expect(mockAddEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
    act(() => {
      mockAddEventListener.mock.calls[0][1]();
    });

    await waitForNextUpdate();
    expect(getDeviceInfo).toHaveBeenCalledTimes(2);
  });

  it('should remove "devicechange" listener on component unmount', async () => {
    const { waitForNextUpdate, unmount } = renderHook(useDevices);
    await waitForNextUpdate();
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
  });
});
