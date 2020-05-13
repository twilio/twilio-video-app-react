import isPlainObject from 'is-plain-object';

export const isMobile = (() => {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();

// This function ensures that the user has granted the browser permission to use audio and video
// devices. If permission has not been granted, it will cause the browser to ask for permission
// for audio and video at the same time (as opposed to separate requests).
export function ensureMediaPermissions() {
  return navigator.mediaDevices
    .enumerateDevices()
    .then(devices => devices.every(device => !(device.deviceId && device.label)))
    .then(shouldAskForMediaPermissions => {
      if (shouldAskForMediaPermissions) {
        return navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then(mediaStream => mediaStream.getTracks().forEach(track => track.stop()));
      }
    });
}

// Recursively removes any object keys with a value of undefined
export function removeUndefineds<T>(obj: T): T {
  if (!isPlainObject(obj)) return obj;

  const target: { [name: string]: any } = {};

  for (const key in obj) {
    const val = obj[key];
    if (typeof val !== 'undefined') {
      target[key] = removeUndefineds(val);
    }
  }

  return target as T;
}
