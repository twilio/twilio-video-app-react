import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
    onError,
  } = useVideoContext();
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const [isPublishing, setIspublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        videoTrack.stop();
      } else {
        setIspublishing(true);
        getLocalVideoTrack()
          .then((track: LocalVideoTrack) => localParticipant?.publishTrack(track, { priority: 'low' }))
          .catch(onError)
          .finally(() => setIspublishing(false));
      }
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, isPublishing, onError]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
