import { useState, useEffect } from 'react';

export default function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = () => navigator.mediaDevices.enumerateDevices().then(newDevices => setDevices(newDevices));
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return {
    audioInputDevices: devices.filter(device => device.kind === 'audioinput'),
    videoInputDevices: devices.filter(device => device.kind === 'videoinput'),
    audioOutputDevices: devices.filter(device => device.kind === 'audiooutput'),
    hasAudioInputDevices: devices.filter(device => device.kind === 'audioinput').length > 0,
    hasVideoInputDevices: devices.filter(device => device.kind === 'videoinput').length > 0,
  };
}
