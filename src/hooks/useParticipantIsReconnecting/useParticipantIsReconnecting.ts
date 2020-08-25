import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';
import { ROOM_STATE } from '../../utils/displayStrings';

export default function useParticipantIsReconnecting(participant: Participant) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleReconnecting = () => setIsReconnecting(true);
    const handleReconnected = () => setIsReconnecting(false);

    participant.on(ROOM_STATE.RECONNECTING, handleReconnecting);
    participant.on(ROOM_STATE.RECONNECTED, handleReconnected);
    return () => {
      participant.off(ROOM_STATE.RECONNECTING, handleReconnecting);
      participant.off(ROOM_STATE.RECONNECTED, handleReconnected);
    };
  }, [participant]);

  return isReconnecting;
}
