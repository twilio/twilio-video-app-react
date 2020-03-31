import React, { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const ref = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    const el = ref.current;
    track.attach(el);

    if (window.location.search.includes('pauseplay=true')) {
      el.pause();
      el.play();
      console.log('called pause()/play() on ', track);
    }

    return () => {
      track.detach(el);
    };
  }, [track]);

  return <audio ref={ref} />;
}
