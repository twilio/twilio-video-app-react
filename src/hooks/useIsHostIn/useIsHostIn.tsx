import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect, useState } from 'react';
import { RemoteParticipant, Room } from 'twilio-video';
import { ParticipantIdentity } from '../../utils/participantIdentity';

export default function useIsHostIn() {
  const { room } = useVideoContext();
  const [isHostIn, setIsHostIn] = useState(true);

  useEffect(() => {
    if (!checkIsHostIn(room)) {
      setIsHostIn(false);
    }
  }, [room]);

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      if (ParticipantIdentity.Parse(participant.identity).partyType === PARTICIANT_TYPES.REPORTER) {
        setIsHostIn(true);
      }
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (
        ParticipantIdentity.Parse(participant.identity).partyType === PARTICIANT_TYPES.REPORTER &&
        !checkIsHostIn(room)
      ) {
        setIsHostIn(false);
      }
    };

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return isHostIn;

  function checkIsHostIn(theRoom: Room) {
    if (theRoom !== null && typeof theRoom.participants !== 'undefined') {
      let flag = false;
      theRoom.participants.forEach(participant => {
        if (ParticipantIdentity.Parse(participant.identity).partyType === PARTICIANT_TYPES.REPORTER) {
          flag = true;
        }
      });
      if (
        ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === PARTICIANT_TYPES.REPORTER ||
        ParticipantIdentity.Parse(theRoom.localParticipant.identity).partyType === PARTICIANT_TYPES.HEARING_OFFICER
      ) {
        flag = true;
      }

      return flag;
    }

    return true;
  }
}
