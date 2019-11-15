import { useEffect, useState } from 'react';
import { useVideoContext } from '../context';

import { Participant, TrackPublication } from 'twilio-video';

export default function useScreenShareParticipant() {
  const { room } = useVideoContext();
  const [screenShareParticipant, setScreenShareParticipant] = useState();

  useEffect(() => {
    if (room.state === 'connected') {
      const updateScreenShareParticipant = () => {
        setScreenShareParticipant(
          Array.from<Participant>(room.participants.values())
            // the screenshare particiipant could be the localParticipant
            .concat(room.localParticipant)
            .find((participant: Participant) =>
              Array.from<TrackPublication>(participant.tracks.values()).find(track => track.trackName === 'screen')
            )
        );
      };
      updateScreenShareParticipant();
      room.on('trackPublished', updateScreenShareParticipant);
      room.on('trackUnpublished', updateScreenShareParticipant);
      room.on('participantDisconnected', updateScreenShareParticipant);

      // the room object does not emit 'trackPublished' events for the localPartipant,
      // so we need to listen for them here.
      room.localParticipant.on('trackPublished', updateScreenShareParticipant);
      room.localParticipant.on('trackUnpublished', updateScreenShareParticipant);
      return () => {
        room.off('trackPublished', updateScreenShareParticipant);
        room.off('trackUnpublished', updateScreenShareParticipant);
        room.off('participantDisconnected', updateScreenShareParticipant);
        room.localParticipant.off('trackPublished', updateScreenShareParticipant);
        room.localParticipant.off('trackUnpublished', updateScreenShareParticipant);
      };
    }
  }, [room]);

  return screenShareParticipant;
}
