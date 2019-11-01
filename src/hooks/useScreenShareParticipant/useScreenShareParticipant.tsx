import { useState, useEffect } from 'react';
import { useVideoContext } from '../context';

import {
  RemoteParticipant,
  LocalParticipant,
  LocalTrackPublication,
  RemoteTrackPublication,
} from 'twilio-video';

function findScreenShareTrackPublication(
  participant: RemoteParticipant | LocalParticipant
) {
  return Array.from<LocalTrackPublication | RemoteTrackPublication>(
    participant.tracks.values()
  ).find(track => track.trackName === 'screen');
}

export default function useScreenShareParticipant() {
  const { room } = useVideoContext();
  const [screenShareParticipant, setScreenShareParticipant] = useState();

  useEffect(() => {
    const updateScreenShareParticipant = () => {
      setScreenShareParticipant(
        Array.from<RemoteParticipant | LocalParticipant>(
          room.participants.values()
        )
          .concat(room.localParticipant)
          .find(findScreenShareTrackPublication)
      );
    };
    updateScreenShareParticipant();
    room.on('trackPublished', updateScreenShareParticipant);
    room.on('trackUnpublished', updateScreenShareParticipant);
    return () => {
      room.off('trackPublished', updateScreenShareParticipant);
      room.off('trackUnpublished', updateScreenShareParticipant);
    };
  }, [room]);

  return screenShareParticipant;
}
