import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined;

export default function useMediaStreamTrack(track?: TrackType) {
  const [mediaStreamTrack, setMediaStreamTrack] = useState(track?.mediaStreamTrack);

  useEffect(() => {
    setMediaStreamTrack(track?.mediaStreamTrack);

    if (track) {
      const handleStarted = () => setMediaStreamTrack(track.mediaStreamTrack);

      track.on('started', handleStarted);
      return () => {
        track.off('started', handleStarted);
      };
    }
  }, [track]);

  return mediaStreamTrack;
}
