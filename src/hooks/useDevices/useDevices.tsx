import { useState, useEffect } from 'react';
import { getDeviceInfo } from '../../utils';

// This returns the type of the value that is returned by a promise resolution
type ThenArg<T> = T extends PromiseLike<infer U> ? U : never;

export default function useDevices() {
  const [deviceInfo, setDeviceInfo] = useState<ThenArg<ReturnType<typeof getDeviceInfo>>>({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
    hasAudioInputDevices: false,
    hasVideoInputDevices: false,
  });

  useEffect(() => {
    const getDevices = () => getDeviceInfo().then(devices => setDeviceInfo(devices));
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return deviceInfo;
}
