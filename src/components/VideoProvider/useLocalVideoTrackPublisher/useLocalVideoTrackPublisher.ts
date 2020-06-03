import { useEffect, useState } from 'react';
import { Room, LocalTrack, LocalVideoTrackPublication } from 'twilio-video';

export default function useLocalVideoTrackPublisher(room: Room, localTracks: LocalTrack[]) {
  const [isPublishingLocalVideoTrack, setIsPublishing] = useState(false);
  useEffect(() => {
    if (room.state === 'connected') {
      const videoTrack = localTracks.find(track => track.name.includes('camera'));
      const publishedVideoTrackPublications = [
        ...room.localParticipant.videoTracks.values(),
      ] as LocalVideoTrackPublication[];
      const publishedVideoTrack = publishedVideoTrackPublications.find(pub => pub.trackName.includes('camera'))?.track;

      if (videoTrack && !publishedVideoTrack && !isPublishingLocalVideoTrack) {
        setIsPublishing(true);
        room.localParticipant.publishTrack(videoTrack, { priority: 'low' }).then(() => {
          setIsPublishing(false);
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
