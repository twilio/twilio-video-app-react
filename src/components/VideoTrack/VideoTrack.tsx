import React, { useRef, useEffect } from 'react';
import { Track, VideoTrack as IVideoTrack } from 'twilio-video';
import { styled } from '@material-ui/core/styles';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority;
}

export default function VideoTrack({ track, isLocal, priority = 'low' }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    if (track.setPriority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority) {
        track.setPriority('low');
      }
    };
  }, [track, priority]);

  const style = isLocal ? { transform: 'rotateY(180deg)' } : {};

  return <Video ref={ref} style={style} />;
}
