import { useEffect, useState } from 'react';
import { LocalTrackPublication, RemoteTrackPublication } from 'twilio-video';

export default function useTrack(publication: LocalTrackPublication | RemoteTrackPublication) {
  const [track, setTrack] = useState(publication.track);

  useEffect(() => {
    const removeTrack = () => setTrack(null);

    setTrack(publication.track);
    publication.on('subscribed', setTrack);
    publication.on('unsubscribed', removeTrack);
    return () => {
      publication.off('subscribed', setTrack);
      publication.off('unsubscribed', removeTrack);
    };
  }, [publication]);

  return track;
}
