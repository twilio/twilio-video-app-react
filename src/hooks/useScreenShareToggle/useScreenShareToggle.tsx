import { useState, useCallback, useRef } from 'react';
import { useVideoContext } from '../context';
import { LogLevels, Track } from 'twilio-video';

interface MediaStreamTrackPublishOptions {
  name?: string;
  priority: Track.Priority;
  logLevel: LogLevels;
}

export default function useScreenShareToggle() {
  const { room } = useVideoContext();
  const [isSharing, setIsSharing] = useState(false);
  const stopScreenShareRef = useRef<() => void>(null!);

  const shareScreen = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    const track = stream.getTracks()[0];

    const trackPublication = await room.localParticipant.publishTrack(track, {
      name: 'screen',
      priority: 'high',
    } as MediaStreamTrackPublishOptions);

    stopScreenShareRef.current = () => {
      room.localParticipant.unpublishTrack(track);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      room.localParticipant.emit('trackUnpublished', trackPublication);
      track.stop();
      setIsSharing(false);
    };

    track.onended = stopScreenShareRef.current;

    setIsSharing(true);
  }, [room]);

  const toggle = useCallback(() => {
    !isSharing ? shareScreen() : stopScreenShareRef.current();
  }, [isSharing, shareScreen, stopScreenShareRef]);

  return [isSharing, toggle] as const;
}
