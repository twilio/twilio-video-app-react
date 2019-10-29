import { useEffect, useState } from 'react';
import {
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
} from 'twilio-video';

type TrackPublication = LocalTrackPublication | RemoteTrackPublication;

export default function usePublications(participant: Participant) {
  const [publications, setPublications] = useState<TrackPublication[]>(
    Array.from(participant.tracks.values()) as TrackPublication[]
  );

  useEffect(() => {
    const publicationAdded = (publication: TrackPublication) =>
      setPublications(publications => [...publications, publication]);
    const publicationRemoved = (publication: TrackPublication) =>
      setPublications(publications =>
        publications.filter(p => p !== publication)
      );

    participant.on('trackPublished', publicationAdded);
    participant.on('trackRemoved', publicationRemoved);
    return () => {
      participant.off('trackPublished', publicationAdded);
      participant.off('trackRemoved', publicationRemoved);
    };
  }, [participant, setPublications]);

  return publications;
}
