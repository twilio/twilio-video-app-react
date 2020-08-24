import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';
import { ROOMSTATE } from '../../utils/displayStrings';

export default function useParticipantIsReconnecting(participant: Participant) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleReconnecting = () => setIsReconnecting(true);
    const handleReconnected = () => setIsReconnecting(false);

    participant.on(ROOMSTATE.RECONNECTING, handleReconnecting);
    participant.on(ROOMSTATE.RE_CONNECTED, handleReconnected);
    return () => {
      participant.off(ROOMSTATE.RECONNECTING, handleReconnecting);
      participant.off(ROOMSTATE.RE_CONNECTED, handleReconnected);
    };
  }, [participant]);

  return isReconnecting;
}
