import { useEffect, useState } from 'react';
import Video, { LocalTrack } from 'twilio-video';

export default function useLocalTracks() {
  const [tracks, setTracks] = useState<LocalTrack[]>([]);

  useEffect(() => {
    Video.createLocalTracks({
      audio: { name: 'microphone' },
      video: { name: 'camera', width: { ideal: 1280 }, height: { ideal: 720 } },
    }).then(tracks => setTracks(tracks as LocalTrack[]));
  }, [setTracks]);

  return tracks;
}
