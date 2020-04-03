import { useEffect } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  useEffect(() => {
    document.body.appendChild(track.attach());
    return () => track.detach().forEach(el => el.remove());
  }, [track]);
  return null;
}
