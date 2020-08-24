import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useRef, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../utils/displayStrings';

export default function useLocalVideoToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
    removeLocalVideoTrack,
    onError,
  } = useVideoContext();
  const videoTrack = localTracks.find(track => track.kind === TRACK_TYPE.VIDEO);
  const [isPublishing, setIspublishing] = useState(false);
  const previousDeviceIdRef = useRef<string>();

  const toggleVideoEnabled = useCallback(() => {
    //if (!isPublishing) {
    if (videoTrack) {
      if (localParticipant) {
        previousDeviceIdRef.current = videoTrack.mediaStreamTrack.getSettings().deviceId;
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592

        const localTrackPublication = localParticipant.unpublishTrack(videoTrack);
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        // removeLocalVideoTrack();
      }
      videoTrack!.stop();
    } else {
      setIspublishing(true);
      getLocalVideoTrack({ deviceId: { exact: previousDeviceIdRef.current } })
        .then((track: LocalVideoTrack) => localParticipant?.publishTrack(track, { priority: 'low' }))
        .catch(onError)
        .finally(() => setIspublishing(false));
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, isPublishing, onError]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
