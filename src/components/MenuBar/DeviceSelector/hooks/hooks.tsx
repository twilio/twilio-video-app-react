import { useState, useEffect } from 'react';
import { ensureMediaPermissions } from '../../../../utils';

export function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = () =>
      ensureMediaPermissions().then(() =>
        navigator.mediaDevices.enumerateDevices().then(devices => setDevices(devices))
      );
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return devices;
}

export function useAudioInputDevices() {
  const devices = useDevices();
  return devices.filter(device => device.kind === 'audioinput');
}

export function useVideoInputDevices() {
  const devices = useDevices();
  return devices.filter(device => device.kind === 'videoinput');
}

export function useAudioOutputDevices() {
  const devices = useDevices();
  return devices.filter(device => device.kind === 'audiooutput');
}
