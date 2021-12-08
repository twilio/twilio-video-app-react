import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from 'types/types';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import useVideoTrackDimensions from '../../hooks/useVideoTrackDimensions/useVideoTrackDimensions';

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
  className?: string;
}

export default function VideoTrack({ track, isLocal, priority, className }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);
  const dimensions = useVideoTrackDimensions(track);
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;

      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const style = {
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
    objectFit: isPortrait || track.name.includes('screen') ? ('contain' as const) : ('cover' as const),
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="absolute -top-5 -left-5 -bottom-5 -right-5 ">
        <video ref={ref} style={style} className={'w-full h-full outline-none'} />
      </div>
    </div>
  );
}
