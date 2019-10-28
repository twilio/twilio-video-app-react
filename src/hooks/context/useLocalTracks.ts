import { useEffect, useState } from 'react';
import Video, { LocalTrack } from 'twilio-video';

export default function useLocalTracks() {
  const [tracks, setTracks] = useState<LocalTrack[]>([]);

  useEffect(() => {
    Video.createLocalTracks({
      audio: { name: 'microphone' },
      video: { name: 'camera' },
    }).then(tracks => setTracks(tracks as LocalTrack[]));
  }, [setTracks]);

  return tracks;
}
