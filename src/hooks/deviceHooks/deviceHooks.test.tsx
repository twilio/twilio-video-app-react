import { act, renderHook } from '@testing-library/react-hooks';
import * as deviceHooks from './deviceHooks';

let mockDevices = [
  { deviceId: 1, label: '1', kind: 'audioinput' },
  { deviceId: 2, label: '2', kind: 'videoinput' },
  { deviceId: 3, label: '3', kind: 'audiooutput' },
];
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

describe('the useAudioInputDevices hook', () => {
  it('should return a list of audio input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useAudioInputDevices);
    await waitForNextUpdate();
    expect(result.current).toEqual([mockDevices[0]]);
  });
});

describe('the useVideoInputDevices hook', () => {
  it('should return a list of video input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useVideoInputDevices);
    await waitForNextUpdate();
    expect(result.current).toEqual([mockDevices[1]]);
  });
});

describe('the useAudioOutputDevices hook', () => {
  it('should return a list of audio output devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useAudioOutputDevices);
    await waitForNextUpdate();
    expect(result.current).toEqual([mockDevices[2]]);
  });
});

describe('the useHasAudioInputDevices hook', () => {
  it('should return true when there are audio input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: 'audioinput' }]);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useHasAudioInputDevices);
    await waitForNextUpdate();
    expect(result.current).toBe(true);
  });

  it('should return false when there are no audio input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: 'videoinput' }]);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useHasAudioInputDevices);
    await waitForNextUpdate();
    expect(result.current).toBe(false);
  });
});

describe('the useHasVideoInputDevices hook', () => {
  it('should return true when there are video input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: 'videoinput' }]);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useHasVideoInputDevices);
    await waitForNextUpdate();
    expect(result.current).toBe(true);
  });

  it('should return false when there are no video input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: 'audioinput' }]);
    const { result, waitForNextUpdate } = renderHook(deviceHooks.useHasVideoInputDevices);
    await waitForNextUpdate();
    expect(result.current).toBe(false);
  });
});
