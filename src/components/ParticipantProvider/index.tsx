import React, { createContext } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useGridParticipants from '../../hooks/useGridParticipants/useGridParticipants';
import usePresentationParticipants from '../../hooks/usePresentationParticipants/usePresentationParticipants';

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
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
