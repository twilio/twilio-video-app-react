import { Room } from 'twilio-video';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function useIsHostIn() {
  const { room } = useVideoContext();

  room.participants.forEach(participant => {
    if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
      return true;
    }
  });
  if (room.localParticipant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
    return true;
  }

  return false;
}
