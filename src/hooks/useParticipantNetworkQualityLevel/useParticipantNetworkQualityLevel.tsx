import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';

export default function useParticipantNetworkQualityLevel(participant: Participant) {
  const [networkQualityLevel, setNetworkQualityLevel] = useState(participant.networkQualityLevel);

  useEffect(() => {
    const handleNetworkQualityLevelChange = (newNetworkQualityLevel: number) =>
      setNetworkQualityLevel(newNetworkQualityLevel);

    setNetworkQualityLevel(participant.networkQualityLevel);
    participant.on('networkQualityLevelChanged', handleNetworkQualityLevelChange);
    return () => {
      participant.off('networkQualityLevelChanged', handleNetworkQualityLevelChange);
    };
  }, [participant]);

  return networkQualityLevel;
}
