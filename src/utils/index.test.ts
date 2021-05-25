import { getDeviceInfo, isPermissionDenied, removeUndefineds } from '.';

describe('the removeUndefineds function', () => {
  it('should recursively remove any object keys with a value of undefined', () => {
    const data = {
      a: 0,
      b: '',
      c: undefined,
      d: null,
      e: {
        a: 0,
        b: '',
        c: undefined,
        d: null,
      },
    };

    const result = {
      a: 0,
      b: '',
      d: null,
      e: {
        a: 0,
        b: '',
        d: null,
      },
    };

    expect(removeUndefineds(data)).toEqual(result);
  });
});

describe('the getDeviceInfo function', () => {
  // @ts-ignore
  navigator.mediaDevices = {};

  let mockDevices = [
    { deviceId: 1, label: '1', kind: 'audioinput' },
    { deviceId: 2, label: '2', kind: 'videoinput' },
    { deviceId: 3, label: '3', kind: 'audiooutput' },
  ];

  it('should correctly return a list of audio input devices', async () => {
    // @ts-ignore
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve(mockDevices);
    const result = await getDeviceInfo();
    expect(result).toMatchInlineSnapshot(`
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
    const result = await getDeviceInfo();
    expect(result.hasAudioInputDevices).toBe(false);
  });

  it('should return hasVideoInputDevices: false when there are no video input devices', async () => {
    navigator.mediaDevices.enumerateDevices = () =>
      // @ts-ignore
      Promise.resolve([
        { deviceId: 1, label: '1', kind: 'audioinput' },
        { deviceId: 3, label: '3', kind: 'audiooutput' },
      ]);
    const result = await getDeviceInfo();
    expect(result.hasVideoInputDevices).toBe(false);
  });
});

describe('the isPermissionsDenied function', () => {
  it('should return false when navigator.permissions does not exist', () => {
    // @ts-ignore
    navigator.permissions = undefined;

    expect(isPermissionDenied('camera')).resolves.toBe(false);
  });

  it('should return false when navigator.permissions.query throws an error', () => {
    // @ts-ignore
    navigator.permissions = { query: () => Promise.reject() };

    expect(isPermissionDenied('camera')).resolves.toBe(false);
  });

  it('should return false when navigator.permissions.query returns "granted"', () => {
    // @ts-ignore
    navigator.permissions = { query: () => Promise.resolve({ state: 'granted' }) };

    expect(isPermissionDenied('camera')).resolves.toBe(false);
  });

  it('should return true when navigator.permissions.query returns "denied"', () => {
    // @ts-ignore
    navigator.permissions = { query: () => Promise.resolve({ state: 'denied' }) };

    expect(isPermissionDenied('camera')).resolves.toBe(true);
  });
});
