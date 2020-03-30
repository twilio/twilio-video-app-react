import { useEffect, useState } from 'react';
import { Participant } from 'twilio-video';

export default function useParticipantNetworkQualityLevel(participant: Participant) {
  const [networkQualityLevel, setNetworkQualityLevel] = useState(participant.networkQualityLevel);

  useEffect(() => {
    const handleNewtorkQualityLevelChange = (newNetworkQualityLevel: number) =>
      setNetworkQualityLevel(newNetworkQualityLevel);

    setNetworkQualityLevel(participant.networkQualityLevel);
    participant.on('networkQualityLevelChanged', handleNewtorkQualityLevelChange);
    return () => {
      participant.off('networkQualityLevelChanged', handleNewtorkQualityLevelChange);
    };
  }, [participant]);

  return networkQualityLevel;
}
