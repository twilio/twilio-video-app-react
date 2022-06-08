import { useEffect, useState } from 'react';
import { LocalTrackPublication, Participant, RemoteTrackPublication } from 'twilio-video';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';

type TrackPublication = LocalTrackPublication | RemoteTrackPublication;

let isPublishing = false;
let isUnPublishing = false;

const isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

export default function usePublications(participant: Participant) {
  const [publications, setPublications] = useState<TrackPublication[]>([]);
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();

  (window as any).foo = () => {
    const room = (window as any).twilioRoom;
    const participants = Array.from(room.participants.values());
    participants.forEach((p: any) => {
      const track = Array.from(p.videoTracks.values())[0] as any;
      console.log(track._track.dimensions)
    });
  };

  useEffect(() => {
    // Reset the publications when the 'participant' variable changes.
    setPublications(Array.from(participant.tracks.values()) as TrackPublication[]);

    const publicationAdded = (publication: TrackPublication) => {
      if (participant.identity === 'Charlie' && !isVideoEnabled && !isPublishing && !isFirefox) {
        isPublishing = true;

        setTimeout(() => {
          toggleVideoEnabled();

          setTimeout(() => {
            isPublishing = false;
          }, 2000);

        }, 0);
      }
      return setPublications(prevPublications => [...prevPublications, publication]);
    };
    const publicationRemoved = (publication: TrackPublication) => {
      if (participant.identity === 'Charlie' && isVideoEnabled && !isUnPublishing && !isFirefox) {
        isUnPublishing = true;

        setTimeout(() => {
          toggleVideoEnabled();

          setTimeout(() => {
            isUnPublishing = false;
          }, 2000);

        }, 0);
      }
      return setPublications(prevPublications => prevPublications.filter(p => p !== publication));
    };

    participant.on('trackPublished', publicationAdded);
    participant.on('trackUnpublished', publicationRemoved);
    return () => {
      participant.off('trackPublished', publicationAdded);
      participant.off('trackUnpublished', publicationRemoved);
    };
  }, [participant, isVideoEnabled, toggleVideoEnabled]);

  return publications;
}
