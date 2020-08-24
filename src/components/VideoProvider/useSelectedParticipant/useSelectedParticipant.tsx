import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant, Room } from 'twilio-video';
import { ROOMSTATE } from '../../../utils/displayStrings';

type selectedParticipantContextType = [Participant | null, (participant: Participant) => void];

export const selectedParticipantContext = createContext<selectedParticipantContextType>(null!);

export default function useSelectedParticipant() {
  const [selectedParticipant, setSelectedParticipant] = useContext(selectedParticipantContext);
  return [selectedParticipant, setSelectedParticipant] as const;
}

type SelectedParticipantProviderProps = {
  room: Room;
  children: React.ReactNode;
};

export function SelectedParticipantProvider({ room, children }: SelectedParticipantProviderProps) {
  const [selectedParticipant, _setSelectedParticipant] = useState<Participant | null>(null);
  const setSelectedParticipant = (participant: Participant) =>
    _setSelectedParticipant(prevParticipant => (prevParticipant === participant ? null : participant));

  useEffect(() => {
    const onDisconnect = () => _setSelectedParticipant(null);
    room.on(ROOMSTATE.DISCONNECTED, onDisconnect);
    return () => {
      room.off(ROOMSTATE.DISCONNECTED, onDisconnect);
    };
  }, [room]);

  return (
    <selectedParticipantContext.Provider value={[selectedParticipant, setSelectedParticipant]}>
      {children}
    </selectedParticipantContext.Provider>
  );
}
