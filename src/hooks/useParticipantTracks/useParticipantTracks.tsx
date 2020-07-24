import { useEffect, useState } from 'react';
import { Participant, LocalTrackPublication, RemoteTrackPublication, RemoteTrack } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';

type Publication = LocalTrackPublication | RemoteTrackPublication;

function notNull<T>(value: T | null): value is T {
  return value !== null;
}

const getTracks = (participant: Participant) => Array.from(participant.tracks.values()) as Publication[];

export default function useParticipantTracks(participant: Participant) {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const [publications, setPublications] = useState(getTracks(participant));

  useEffect(() => {
    // Reset the track when the 'participant' variable changes.
    setPublications(getTracks(participant));

    const isLocalParticipant = participant === localParticipant;

    const handleTrackPublished = (publication: LocalTrackPublication) =>
      setPublications(prevPublications => [...prevPublications, publication]);
    const handleTrackUnpublished = (publication: LocalTrackPublication) =>
      setPublications(prevPublications => prevPublications.filter(p => p !== publication));

    const handleTrackSubscribed = (_: RemoteTrack, publication: RemoteTrackPublication) =>
      setPublications(prevPublications => [...prevPublications, publication]);
    const handleTrackUnsubscribed = (_: RemoteTrack, publication: RemoteTrackPublication) =>
      setPublications(prevPublications => prevPublications.filter(p => p !== publication));

    if (isLocalParticipant) {
      participant.on('trackPublished', handleTrackPublished);
      participant.on('trackUnpublished', handleTrackUnpublished);
    } else {
      participant.on('trackSubscribed', handleTrackSubscribed);
      participant.on('trackUnsubscribed', handleTrackUnsubscribed);
    }

    return () => {
      if (isLocalParticipant) {
        participant.off('trackPublished', handleTrackPublished);
        participant.off('trackUnpublished', handleTrackUnpublished);
      } else {
        participant.off('trackSubscribed', handleTrackSubscribed);
        participant.off('trackUnsubscribed', handleTrackUnsubscribed);
      }
    };
  }, [participant, localParticipant]);

  return publications.map(pub => pub.track).filter(notNull);
}
