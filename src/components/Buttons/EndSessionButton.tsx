import { Alert } from 'components/Alert';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState } from 'react';
import { endSession } from 'utils/firebase/session';
import { RoundButton } from './RoundButton';

export const EndSessionButton = () => {
  const { groupToken } = useSessionContext();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <Alert
        title={'DemokraTisch Raum schließen'}
        text="Möchtest du diesen DemokraTisch Raum für alle Teilnehmer schließen und somit das Spiel beenden?"
        onApprove={() => groupToken !== undefined && endSession(groupToken)}
        open={showAlert}
        setOpen={setShowAlert}
      />
      <RoundButton onClick={() => setShowAlert(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </RoundButton>
    </>
  );
};
