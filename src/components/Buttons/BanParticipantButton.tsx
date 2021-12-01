import { Alert } from 'components/Alert';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState } from 'react';
import { banParticipant } from 'utils/firebase/session';
import { nameFromIdentity, uidFromIdentity } from 'utils/participants';
import { RoundButton, ROUND_BUTTON_SIZE, ROUND_BUTTON_STYLE } from './RoundButton';

interface BanParticipantButtonProps {
  identity: string;
}

export const BanParticipantButton = (props: BanParticipantButtonProps) => {
  const { groupToken } = useSessionContext();
  const [showAlert, setShowAlert] = useState(false);

  const onBanPlayer = () => {
    if (groupToken) {
      banParticipant(groupToken, props.identity);
    }
  };

  return (
    <>
      <Alert
        title={`Spieler '${nameFromIdentity(props.identity)}' ausschließen`}
        text="Möchtest du den Spieler aus dem Raum entfernen? Achtung: Der Ausschluss kann mit etwas Aufwand umgangen werden."
        onApprove={onBanPlayer}
        open={showAlert}
        setOpen={setShowAlert}
      />
      <RoundButton
        title="Spieler aus dem DemokraTisch ausschließen"
        size={ROUND_BUTTON_SIZE.SEMI_SMALL}
        style={ROUND_BUTTON_STYLE.DECILE}
        onClick={() => setShowAlert(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </RoundButton>
    </>
  );
};
