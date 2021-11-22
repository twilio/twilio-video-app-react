import useSessionContext from 'hooks/useSessionContext';
import React from 'react';
import { useEffect, useState } from 'react';
import { MutableRefObject } from 'react-transition-group/node_modules/@types/react';
import { UserGroup } from 'types';
import { raiseHand, subscribeToSessionStore, unraiseHand, unsubscribeFromSessionStore } from 'utils/firebase/session';
import { RoundButton } from './RoundButton';

interface IRaiseHandButtonProps {
  identityRef: MutableRefObject<string | undefined>;
}

export const RaiseHandButton = (props: IRaiseHandButtonProps) => {
  const { groupToken } = useSessionContext();
  const [handRaised, setHandRaised] = useState(false);
  const [cooldown, setCooldown] = useState<boolean>(false);
  const [cooldownTimeout, setCooldownTimeout] = useState<NodeJS.Timeout>();
  const COOLDOWN_DURATION = 1000;

  const toggleHandRaise = () => {
    if (groupToken === undefined || props.identityRef.current === undefined) {
      return;
    } else if (handRaised) {
      unraiseHand(groupToken, props.identityRef.current);
    } else {
      raiseHand(groupToken, props.identityRef.current);
    }
  };

  const onClick = () => {
    if (cooldown) {
      return;
    }

    toggleHandRaise();

    const tm = setTimeout(() => {
      setCooldown(false);
    }, COOLDOWN_DURATION);
    setCooldownTimeout(tm);
    setCooldown(true);
  };

  useEffect(() => {
    return () => {
      if (cooldownTimeout !== undefined) {
        clearTimeout(cooldownTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const subId = 'RAISE_HAND_BUTTON';

    if (groupToken !== undefined) {
      subscribeToSessionStore(subId, groupToken, store => {
        const id = props.identityRef.current;
        if (id === undefined) {
          return;
        }

        const raisedHands = store.data.raisedHands ?? [];
        setHandRaised(raisedHands.includes(id));
      });
    }

    return () => {
      unsubscribeFromSessionStore(subId);

      if (groupToken && props.identityRef.current) {
        unraiseHand(groupToken, props.identityRef.current);
      }
    };
  }, [groupToken, props.identityRef.current]);

  return (
    <RoundButton active={handRaised} onClick={onClick} disabled={cooldown}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
        />
      </svg>
    </RoundButton>
  );
};
