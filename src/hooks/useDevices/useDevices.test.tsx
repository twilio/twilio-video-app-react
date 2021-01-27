import { act, renderHook } from '@testing-library/react-hooks';
import useDevices from './useDevices';

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

  it('should correctly return a list of audio input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "audioInputDevices": Array [
          Object {
            "deviceId": 1,
            "kind": "audioinput",
            "label": "1",
          },
        ],
        "audioOutputDevices": Array [
          Object {
            "deviceId": 3,
            "kind": "audiooutput",
            "label": "3",
          },
        ],
        "hasAudioInputDevices": true,
        "hasVideoInputDevices": true,
        "videoInputDevices": Array [
          Object {
            "deviceId": 2,
            "kind": "videoinput",
            "label": "2",
          },
        ],
      }
    `);
  });

  it('should return hasAudioInputDevices: false when there are no audio input devices', async () => {
    navigator.mediaDevices.enumerateDevices = () =>
      // @ts-ignore
      Promise.resolve([
        { deviceId: 2, label: '2', kind: 'videoinput' },
        { deviceId: 3, label: '3', kind: 'audiooutput' },
      ]);
    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(result.current.hasAudioInputDevices).toBe(false);
  });

  it('should return hasAudioInputDevices: false when there are no audio input devices', async () => {
    navigator.mediaDevices.enumerateDevices = () =>
      // @ts-ignore
      Promise.resolve([
        { deviceId: 1, label: '1', kind: 'audioinput' },
        { deviceId: 3, label: '3', kind: 'audiooutput' },
      ]);
    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(result.current.hasVideoInputDevices).toBe(false);
  });

  it('should respond to "devicechange" events', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(mockAddEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
    act(() => {
      navigator.mediaDevices.enumerateDevices = () =>
        // @ts-ignore
        Promise.resolve([{ deviceId: 2, label: '2', kind: 'audioinput' }]);
      mockAddEventListener.mock.calls[0][1]();
    });
    await waitForNextUpdate();
    expect(result.current.audioInputDevices).toEqual([{ deviceId: 2, label: '2', kind: 'audioinput' }]);
  });
});
