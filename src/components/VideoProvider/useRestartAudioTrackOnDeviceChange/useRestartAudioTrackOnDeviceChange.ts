import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import { useEffect } from 'react';

/*
 * If a user has published an audio track from an external audio input device and
 * disconnects the device, the published audio track will be stopped and the user
 * will no longer be heard by other participants.
 *
 * To prevent this issue, this hook will re-acquire a mediaStreamTrack from the system's
 * default audio device when it detects that the published audio device has been disconnected.
 */

export default function useRestartAudioTrackOnDeviceChange(localTracks: (LocalAudioTrack | LocalVideoTrack)[]) {
  const audioTrack = localTracks.find(track => track.kind === 'audio');

  useEffect(() => {
    const handleDeviceChange = () => {
      if (audioTrack?.mediaStreamTrack.readyState === 'ended') {
        audioTrack.restart({});
      }
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [audioTrack]);
}
