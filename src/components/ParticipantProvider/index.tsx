import React, { createContext } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useGridParticipants from '../../hooks/useGridParticipants/useGridParticipants';
import usePresentationParticipants from '../../hooks/usePresentationParticipants/usePresentationParticipants';

/**
 * The purpose of the ParticipantProvider component is to ensure that the hooks useGridParticipants
 * and usePresentationParticipants are not unmounted as users switch between Grid View and Presentation View.
 * This will make sure that the ordering of the participants on the screen will remain so that the most
 * recent dominant speakers are always at the front of the list.
 */

export interface IParticipantContext {
  mobileGridParticipants: RemoteParticipant[];
  gridParticipants: RemoteParticipant[];
  presentationParticipants: RemoteParticipant[];
}

export const ParticipantContext = createContext<IParticipantContext>(null!);

export const ParticipantProvider: React.FC = ({ children }) => {
  const mobileGridParticipants = useGridParticipants(true);
  const gridParticipants = useGridParticipants();
  const presentationParticipants = usePresentationParticipants();

  return (
    <ParticipantContext.Provider
      value={{
        mobileGridParticipants,
        gridParticipants,
        presentationParticipants,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};
