import { useState, useEffect } from 'react';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

export function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => setDevices(devices));
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

export function useMediaStreamTrack(deviceInfo: MediaDeviceInfo) {
  const { localTracks } = useVideoContext();
  const [mediaStreamTrack, setMediaStreamTrack] = useState<MediaStreamTrack | null>(null);

  const existingTrack = localTracks.find(
    track => track.mediaStreamTrack.getSettings().deviceId === deviceInfo.deviceId
  );

  useEffect(() => {
    let newTrack: MediaStreamTrack;

    if (existingTrack) {
      setMediaStreamTrack(existingTrack.mediaStreamTrack);
    } else {
      const type: 'audio' | 'video' = deviceInfo.kind.includes('audio') ? 'audio' : 'video';

      navigator.mediaDevices.getUserMedia({ [type]: { deviceId: { exact: deviceInfo.deviceId } } }).then(device => {
        newTrack = device.getTracks()[0];
        setMediaStreamTrack(newTrack);
      });
    }

    return () => {
      if (newTrack) {
        newTrack.stop();
      }
    };
  }, [deviceInfo, existingTrack]);

  return mediaStreamTrack;
}
