import { useEffect, useState } from 'react';
import { useVideoContext } from '../context';

import { LocalParticipant, LocalTrackPublication, RemoteParticipant, RemoteTrackPublication } from 'twilio-video';

function findScreenShareTrackPublication(participant: RemoteParticipant | LocalParticipant) {
  return Array.from<LocalTrackPublication | RemoteTrackPublication>(participant.tracks.values()).find(
    track => track.trackName === 'screen'
  );
}

export default function useScreenShareParticipant() {
  const { room } = useVideoContext();
  const [screenShareParticipant, setScreenShareParticipant] = useState();

  useEffect(() => {
    if (room.state === 'connected') {
      const updateScreenShareParticipant = () => {
        setScreenShareParticipant(
          Array.from<RemoteParticipant | LocalParticipant>(room.participants.values())
            // the screenshare particiipant could be the localParticipant
            .concat(room.localParticipant)
            .find(findScreenShareTrackPublication)
        );
      };
      updateScreenShareParticipant();
      room.on('trackPublished', updateScreenShareParticipant);
      room.on('trackUnpublished', updateScreenShareParticipant);

      // the room object does not emit 'trackPublished' events for the localPartipant,
      // so we need to listen for them here.
      room.localParticipant.on('trackPublished', updateScreenShareParticipant);
      room.localParticipant.on('trackUnpublished', updateScreenShareParticipant);
      return () => {
        room.off('trackPublished', updateScreenShareParticipant);
        room.off('trackUnpublished', updateScreenShareParticipant);
        room.localParticipant.off('trackPublished', updateScreenShareParticipant);
        room.localParticipant.off('trackUnpublished', updateScreenShareParticipant);
      };
    }
  }, [room]);

  return screenShareParticipant;
}
