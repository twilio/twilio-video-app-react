import { useState, useCallback, useRef } from 'react';
import { useVideoContext } from '../context';
import { LogLevels, Track } from 'twilio-video';
import useErrorHandler from '../useErrorHandler/useErrorHandler';

interface MediaStreamTrackPublishOptions {
  name?: string;
  priority: Track.Priority;
  logLevel: LogLevels;
}

export default function useScreenShareToggle() {
  const { room } = useVideoContext();
  const [isSharing, setIsSharing] = useState(false);
  const stopScreenShareRef = useRef<() => void>(null!);
  const onError = useErrorHandler();

  const shareScreen = useCallback(() => {
    navigator.mediaDevices
      .getDisplayMedia()
      .then(stream => {
        const track = stream.getTracks()[0];

        room.localParticipant
          .publishTrack(track, {
            name: 'screen',
            priority: 'low',
          } as MediaStreamTrackPublishOptions)
          .then(trackPublication => {
            stopScreenShareRef.current = () => {
              room.localParticipant.unpublishTrack(track);
              // TODO: remove this if the SDK is updated to emit this event
              room.localParticipant.emit('trackUnpublished', trackPublication);
              track.stop();
              setIsSharing(false);
            };

            track.onended = stopScreenShareRef.current;
            setIsSharing(true);
          })
          .catch(onError);
      })
      .catch(error => {
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
          onError(error);
        }
      });
  }, [room, onError]);

  const toggle = useCallback(() => {
    !isSharing ? shareScreen() : stopScreenShareRef.current();
  }, [isSharing, shareScreen, stopScreenShareRef]);

  return [isSharing, toggle] as const;
}
