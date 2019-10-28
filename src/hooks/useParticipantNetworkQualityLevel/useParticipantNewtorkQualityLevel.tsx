import { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

export default function useParticipantNetworkQualityLevel(
  participant: LocalParticipant | RemoteParticipant
) {
  const [networkQualityLevel, setNetworkQualityLevel] = useState(
    participant.networkQualityLevel
  );

  useEffect(() => {
    const handleNewtorkQualityLevelChange = (networkQualityLevel: number) =>
      setNetworkQualityLevel(networkQualityLevel);
    participant.on(
      'networkQualityLevelChanged',
      handleNewtorkQualityLevelChange
    );
    participant.on('networkQualityLevelChanged', console.log);
    return () => {
      participant.on(
        'networkQualityLevelChanged',
        handleNewtorkQualityLevelChange
      );
    };
  }, [participant, setNetworkQualityLevel]);

  return networkQualityLevel;
}
