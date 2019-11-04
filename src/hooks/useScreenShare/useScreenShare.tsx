import { useState, useCallback, useRef } from 'react';
import { useVideoContext } from '../context';
import { LogLevels, Track } from 'twilio-video';

declare global {
  interface MediaDevices {
    getDisplayMedia(): Promise<MediaStream>;
  }
}

interface MediaStreamTrackPublishOptions {
  name?: string;
  priority: Track.Priority;
  logLevel: LogLevels;
}

export default function useScreenShare() {
  const { room } = useVideoContext();
  const [isSharing, setIsSharing] = useState();
  const stopScreenShareRef = useRef<() => void>(null!);

  const shareScreen = useCallback(() => {
    navigator.mediaDevices.getDisplayMedia().then(stream => {
      const track = stream.getTracks()[0];

      room.localParticipant
        .publishTrack(track, {
          name: 'screen',
          priority: 'high',
        } as MediaStreamTrackPublishOptions)
        .then(trackPublication => {
          setIsSharing(true);
          stopScreenShareRef.current = () => {
            room.localParticipant.unpublishTrack(track);
            // TODO: remove this
            room.localParticipant.emit('trackUnpublished', trackPublication);
            track.stop();
            setIsSharing(null);
          };
          track.onended = stopScreenShareRef.current;
        });
    });
  }, [room]);

  const toggle = useCallback(() => {
    !isSharing ? shareScreen() : stopScreenShareRef.current();
  }, [isSharing, shareScreen, stopScreenShareRef]);

  return [!!isSharing, toggle] as const;
}
