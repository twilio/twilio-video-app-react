import React, { createContext, useContext, useState } from 'react';
import { Participant } from 'twilio-video';

type selectedParticipantContextType = [Participant | null, (participant: Participant) => void];

export const selectedParticipantContext = createContext<selectedParticipantContextType>(null!);

export default function useSelectedParticipant() {
  const [selectedParticipant, setSelectedParticipant] = useContext(selectedParticipantContext);
  return [selectedParticipant, setSelectedParticipant] as const;
}

export function SelectedParticipantProvider(props: { children: React.ReactNode }) {
  const [selectedParticipant, _setSelectedParticipant] = useState<Participant | null>(null);
  const setSelectedParticipant = (participant: Participant) =>
    _setSelectedParticipant(prevParticipant => (prevParticipant === participant ? null : participant));
  return (
    <selectedParticipantContext.Provider value={[selectedParticipant, setSelectedParticipant]}>
      {props.children}
    </selectedParticipantContext.Provider>
  );
}
