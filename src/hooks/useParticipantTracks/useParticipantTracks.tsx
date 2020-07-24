import { useEffect, useState } from 'react';
import { Participant, LocalTrackPublication, RemoteTrackPublication } from 'twilio-video';

type Publication = LocalTrackPublication | RemoteTrackPublication;

function notNull<T>(value: T | null): value is T {
  return value !== null;
}

const getTracks = (participant: Participant) => Array.from(participant.tracks.values()) as Publication[];

export default function useParticipantTracks(participant: Participant) {
  const [publications, setPublications] = useState(getTracks(participant));

  useEffect(() => {
    // Reset the track when the 'participant' variable changes.
    setPublications(getTracks(participant));

    const handleTrackSubscribed = (publication: Publication) =>
      setPublications(prevPublications => [...prevPublications, publication]);
    const handleTrackUnsubscribed = (publication: Publication) =>
      setPublications(prevPublications => prevPublications.filter(p => p !== publication));

    participant.on('trackPublished', handleTrackSubscribed);
    participant.on('trackUnpublished', handleTrackUnsubscribed);
    return () => {
      participant.off('trackPublished', handleTrackSubscribed);
      participant.off('trackUnpublished', handleTrackUnsubscribed);
    };
  }, [participant]);

  return publications.map(pub => pub.track).filter(notNull);
}
