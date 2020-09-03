import { useState, useEffect } from 'react';
import { ensureMediaPermissions } from '../../src/utils';
import { useSafePromise } from '@alucio/lux-ui'

export function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const makeSafePromise = useSafePromise()

  useEffect(() => {
    const getDevices = async () => {
      try {
        await makeSafePromise(ensureMediaPermissions())
        const devices = await makeSafePromise(navigator.mediaDevices.enumerateDevices())
        setDevices(devices)
      } catch (err) {
        if (!err.isCanceled) throw err
      }
    }

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
