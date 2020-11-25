import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';

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
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        setIsHostIn(true);
      }
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER && !checkIsHostIn(room)) {
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

  function checkIsHostIn(room) {
    if (room !== null && typeof room.participants !== 'undefined') {
      let flag = false;
      room.participants.forEach(participant => {
        if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
          flag = true;
        }
      });
      if (room.localParticipant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        flag = true;
      }

      return flag;
    }

    return true;
  }
}
