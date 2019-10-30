import React, { useRef, useEffect } from 'react';
import { VideoTrack as IVideoTrack } from 'twilio-video';
import { styled } from '@material-ui/core/styles';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
}

export default function VideoTrack({ track, isLocal }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    track.attach(el);
    return () => {
      track.detach(el);
    };
  }, [track]);

  const style = isLocal ? { transform: 'rotateY(180deg)' } : {};

  return <Video ref={ref} style={style} />;
}
