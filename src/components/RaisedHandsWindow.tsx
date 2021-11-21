import useRaisedHands from 'hooks/useRaisedHands';
import useSessionContext from 'hooks/useSessionContext';
import React, { useEffect, useState } from 'react';
import { inviteAudienceMember, subscribeToSessionStore } from 'utils/firebase/session';
import { nameFromIdentity } from 'utils/participants';

export const RaisedHandsWindow = () => {
  const { raisedHandsWindowOpen } = useRaisedHands();
  const [raisedHands, setRaisedHands] = useState<string[]>([]);
  const { groupToken } = useSessionContext();

  useEffect(() => {
    if (groupToken === undefined) {
      return;
    }

    subscribeToSessionStore('RH-Window', groupToken, store => {
      setRaisedHands(store.data.raisedHands ?? []);
    });
  }, []);

  return !raisedHandsWindowOpen ? null : (
    <div className="fixed w-[200px] px-2 left-0 h-full bg-white">
      {raisedHands.map(identity => (
        <div key={identity} className="flex items-center w-full py-3 justify-between">
          <span>{nameFromIdentity(identity)}</span>
          <button
            onClick={() => groupToken && inviteAudienceMember(groupToken, identity)}
            className="flex justify-center items-center w-8 h-8 bg-orange text-white rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
