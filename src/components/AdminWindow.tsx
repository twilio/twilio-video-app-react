import useAdminWindow from 'hooks/useAdminWindow';
import useSessionContext from 'hooks/useSessionContext';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  inviteAudienceMember,
  subscribeToSessionStore,
  unbanParticipant,
  unraiseHand,
  unsubscribeFromSessionStore,
} from 'utils/firebase/session';
import { nameFromIdentity } from 'utils/participants';
import { RoundButton, ROUND_BUTTON_SIZE, ROUND_BUTTON_STYLE } from './Buttons/RoundButton';

interface CategoryHeadingProps {
  title: string;
}

const CategoryHeading = (props: CategoryHeadingProps) => (
  <div>
    <h1 className="text-lg pt-5">{props.title}</h1>
    <hr className="pb-5" />
  </div>
);

interface LineProps {
  children: ReactNode;
  identity: string;
}

const Line = (props: LineProps) => (
  <div className="flex items-center w-full py-3 justify-between">
    <span>{nameFromIdentity(props.identity)}</span>
    <span className="flex space-x-1">{props.children}</span>
  </div>
);

export const AdminWindow = () => {
  const { adminWindowOpen } = useAdminWindow();
  const [raisedHands, setRaisedHands] = useState<string[]>([]);
  const [banned, setBanned] = useState<string[]>([]);
  const { groupToken } = useSessionContext();

  useEffect(() => {
    const subId = 'RH-Window';

    if (groupToken !== undefined) {
      subscribeToSessionStore(subId, groupToken, store => {
        const newRaisedHands = store.data.raisedHands ?? [];
        setRaisedHands(prev => {
          if (JSON.stringify(newRaisedHands) !== JSON.stringify(prev)) {
            return newRaisedHands;
          } else {
            return prev;
          }
        });

        const newBanned = store.data.banned ?? [];
        setBanned(prev => {
          if (JSON.stringify(newBanned) !== JSON.stringify(prev)) {
            return newBanned;
          } else {
            return prev;
          }
        });
      });
    }

    return () => {
      unsubscribeFromSessionStore(subId);
    };
  }, []);

  return !adminWindowOpen ? null : (
    <div className="fixed px-5 right-0 h-full bg-white z-50 shadow-xl">
      <CategoryHeading title="Ausgeschlossene Spieler" />
      {banned.map(identity => (
        <Line identity={identity} key={identity}>
          <RoundButton
            size={ROUND_BUTTON_SIZE.SMALL}
            style={ROUND_BUTTON_STYLE.DECILE}
            onClick={() => groupToken && unbanParticipant(groupToken, identity)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </RoundButton>
        </Line>
      ))}

      <CategoryHeading title="Zuschauer einladen" />
      {raisedHands.map(identity => (
        <Line key={identity} identity={identity}>
          <RoundButton
            size={ROUND_BUTTON_SIZE.SMALL}
            style={ROUND_BUTTON_STYLE.APPROVE}
            onClick={() => groupToken && inviteAudienceMember(groupToken, identity)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </RoundButton>
          <RoundButton
            size={ROUND_BUTTON_SIZE.SMALL}
            style={ROUND_BUTTON_STYLE.DECILE}
            onClick={() => groupToken && unraiseHand(groupToken, identity)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </RoundButton>
        </Line>
      ))}
    </div>
  );
};
