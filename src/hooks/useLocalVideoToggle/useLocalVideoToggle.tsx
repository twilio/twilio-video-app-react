import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const { room, localTracks, getLocalVideoTrack, removeLocalVideoTrack, onError } = useVideoContext();
  const videoTrack = localTracks.find(
    track => !track.name.includes('screen') && track.kind === 'video'
  ) as LocalVideoTrack;
  const [isPublishing, setIspublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      // @ts-ignore
      const localParticipant = window.twilioRoom?.localParticipant;
      if (videoTrack) {
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        removeLocalVideoTrack();
      } else {
        setIspublishing(true);
        getLocalVideoTrack()
          .then((track: LocalVideoTrack) => {
            localParticipant?.publishTrack(track, { priority: 'low' });
          })
          .catch(err => {
            console.log('xxxxx error', err);
          })
          .finally(() => {
            setIspublishing(false);
          });
      }
    }
  }, [videoTrack, getLocalVideoTrack, isPublishing, onError, removeLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
