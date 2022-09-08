import { RemoteParticipant, RemoteTrack } from 'twilio-video';
import { useEffect, useState } from 'react';

export default function useParticipantTracks(participant: RemoteParticipant | undefined) {
  const [tracks, setTracks] = useState<RemoteTrack[]>([]);

  useEffect(() => {
    if (participant) {
      const subscribedTracks = Array.from(participant.tracks.values())
        .filter(trackPublication => trackPublication.track !== null)
        .map(trackPublication => trackPublication.track!);

      setTracks(subscribedTracks);

      const handleTrackSubscribed = (track: RemoteTrack) => setTracks(prevTracks => [...prevTracks, track]);
      const handleTrackUnsubscribed = (track: RemoteTrack) =>
        setTracks(prevTracks => prevTracks.filter(t => t !== track));

      participant.on('trackSubscribed', handleTrackSubscribed);
      participant.on('trackUnsubscribed', handleTrackUnsubscribed);
      return () => {
        participant.off('trackSubscribed', handleTrackSubscribed);
        participant.off('trackUnsubscribed', handleTrackUnsubscribed);
      };
    }
  }, [participant]);

  return tracks;
}
