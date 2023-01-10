import { useEffect, useState } from 'react';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';

export default function useLocalMediaMuted(localMediaTrack?: LocalAudioTrack | LocalVideoTrack) {
  const [isMuted, setIsMuted] = useState(localMediaTrack?.isMuted ?? false);

  useEffect(() => {
    const updateMuted = () => setIsMuted(localMediaTrack?.isMuted ?? false);
    updateMuted();

    localMediaTrack?.on('muted', updateMuted);
    localMediaTrack?.on('unmuted', updateMuted);

    return () => {
      localMediaTrack?.off('muted', updateMuted);
      localMediaTrack?.off('unmuted', updateMuted);
    };
  }, [localMediaTrack]);

  return isMuted;
}
