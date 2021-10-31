import { Alert } from 'components/Alert';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState } from 'react';
import { endSession } from 'utils/firebase/session';

export const EndSessionButton = (props: { className?: string }) => {
  const { groupToken } = useSessionContext();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <Alert
        title={'DemokraTisch Raum schließen'}
        text="Als Moderator können Sie diesen DemokraTisch Raum für alle Teilnehmer schließen. Möchten Sie dies tun?"
        onApprove={() => groupToken !== undefined && endSession(groupToken)}
        open={showAlert}
        setOpen={setShowAlert}
      />
      <button className={props.className} onClick={() => setShowAlert(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </>
  );
};
