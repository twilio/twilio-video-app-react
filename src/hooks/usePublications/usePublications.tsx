import { useEffect, useState } from 'react';
import { LocalTrackPublication, Participant, RemoteTrackPublication } from 'twilio-video';

type TrackPublication = LocalTrackPublication | RemoteTrackPublication;

export default function usePublications(participant: Participant) {
  const [publications, setPublications] = useState<TrackPublication[]>([]);

  useEffect(() => {
    // Reset the publications when the 'participant' variable changes.
    setPublications(Array.from(participant.tracks.values()) as TrackPublication[]);

    const publicationAdded = (publication: TrackPublication) =>
      setPublications(prevPublications => [...prevPublications, publication]);
    const publicationRemoved = (publication: TrackPublication) =>
      setPublications(prevPublications => prevPublications.filter(p => p !== publication));

    participant.on('trackPublished', publicationAdded);
    participant.on('trackUnpublished', publicationRemoved);
    return () => {
      participant.off('trackPublished', publicationAdded);
      participant.off('trackUnpublished', publicationRemoved);
    };
  }, [participant]);

  return publications;
}
