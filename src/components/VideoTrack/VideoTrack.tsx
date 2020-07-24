import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Track, AudioTrack } from 'twilio-video';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';

const Video = styled('video')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

interface VideoTrackProps {
  audioTrack?: AudioTrack;
  videoTrack?: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({ audioTrack, videoTrack, isLocal, priority }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(videoTrack);

  useEffect(() => {
    const el = ref.current;
    audioTrack?.attach(el);
    return () => {
      audioTrack?.detach(el);
    };
  }, [audioTrack]);

  useEffect(() => {
    const el = ref.current;
    if (videoTrack?.setPriority && priority) {
      videoTrack?.setPriority(priority);
    }
    videoTrack?.attach(el);
    return () => {
      videoTrack?.detach(el);
      if (videoTrack?.setPriority && priority) {
        // Passing `null` to setPriority will set the videoTrack's priority to that which it was published with.
        videoTrack?.setPriority(null);
      }
    };
  }, [videoTrack, priority]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const style = isLocal && isFrontFacing ? { transform: 'rotateY(180deg)' } : {};

  return <Video ref={ref} style={style} />;
}
