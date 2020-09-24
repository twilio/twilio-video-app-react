import { useState, useEffect } from 'react';

export function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = () => navigator.mediaDevices.enumerateDevices().then(devices => setDevices(devices));
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

export function useHasAudioInputDevices() {
  const audioDevices = useAudioInputDevices();
  return audioDevices.length > 0;
}

export function useHasVideoInputDevices() {
  const videoDevices = useVideoInputDevices();
  return videoDevices.length > 0;
}
