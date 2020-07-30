import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../../src/types';
import { Track } from 'twilio-video';

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored.
  const isFrontFacing = track.mediaStreamTrack.getSettings().facingMode !== 'environment';
  let style = isLocal && isFrontFacing ? { transform: 'rotateY(180deg)' } : {};
  style = { ...style, ...{ objectFit: 'contain', width: '100%', maxHeight: '100%' } }
  return <video ref={ref} style={style} />;
}
