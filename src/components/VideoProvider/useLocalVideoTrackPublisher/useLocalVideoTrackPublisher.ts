import { useEffect, useState } from 'react';
import { Room, LocalTrack, LocalVideoTrackPublication } from 'twilio-video';

export default function useLocalVideoTrackPublisher(room: Room, localTracks: LocalTrack[]) {
  const [isPublishingLocalVideoTrack, setIsPublishingLocalVideoTrack] = useState(false);
  useEffect(() => {
    if (room.state === 'connected') {
      const videoTrack = localTracks.find(track => track.name.includes('camera'));
      const publishedVideoTrackPublications = [
        ...room.localParticipant.videoTracks.values(),
      ] as LocalVideoTrackPublication[];
      const publishedVideoTrack = publishedVideoTrackPublications.find(pub => pub.trackName.includes('camera'))?.track;

      if (videoTrack && !publishedVideoTrack && !isPublishingLocalVideoTrack) {
        setIsPublishingLocalVideoTrack(true);
        room.localParticipant
          .publishTrack(videoTrack, { priority: 'low' })
          .then(() => {
            setIsPublishingLocalVideoTrack(false);
          })
          .catch(() => {
            setIsPublishingLocalVideoTrack(false);
          });
      }

      if (!videoTrack && publishedVideoTrack) {
        const trackPublication = room.localParticipant.unpublishTrack(publishedVideoTrack);
        room.localParticipant.emit('trackUnpublished', trackPublication); //Todo
      }
    }
  }, [localTracks, room, isPublishingLocalVideoTrack]);

  return isPublishingLocalVideoTrack;
}
