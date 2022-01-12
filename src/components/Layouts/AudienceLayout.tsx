import { RaiseHandButton } from 'components/Buttons/RaiseHandButton';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState, useEffect, useRef } from 'react';
import { UserGroup } from 'types/UserGroup';
import {
  removeAudienceMemberInvitation,
  subscribeToSessionStore,
  unraiseHand,
  unsubscribeFromSessionStore,
} from 'utils/firebase/session';
import { generateIdentity } from 'utils/participants';
import ToggleChatButton from '../Buttons/ToggleChatButton/ToggleChatButton';
import ChatWindow from '../ChatWindow/ChatWindow';
import PreJoinScreens from '../PreJoinScreens/PreJoinScreens';

export const AudienceLayout = () => {
  const { streamId, groupToken } = useSessionContext();
  const [ready, setReady] = useState(false);
  const [identity, setIdentity] = useState<string>();
  const identityRef = useRef<string>();
  identityRef.current = identity;

  const joinCall = (participantRoute: string) => {
    const id = identityRef.current;
    if (id && groupToken) {
      removeAudienceMemberInvitation(groupToken, id).then(() => {
        window.location.href = '/r/' + participantRoute;
      });
    }
  };

  useEffect(() => {
    const subId = 'AUDIENCE_LAYOUT';

    if (groupToken !== undefined) {
      subscribeToSessionStore(subId, groupToken, store => {
        const id = identityRef.current;
        if (id === undefined) {
          return;
        }

        const audienceInvites = store.data.audienceInvites ?? [];

        if (audienceInvites.includes(id)) {
          const [participantRoute] = Object.entries(store.data.shareTokens).find(([token, group]) => {
            return group.toUpperCase() === UserGroup.Participant;
          }) ?? [undefined];

          if (participantRoute !== undefined) {
            joinCall(participantRoute);
          }
        }
      });
    }

    return () => {
      unsubscribeFromSessionStore(subId);

      if (groupToken && identityRef.current) {
        unraiseHand(groupToken, identityRef.current);
      }
    };
  }, [groupToken]);

  return !ready ? (
    <PreJoinScreens
      onReady={name => {
        generateIdentity(name).then(setIdentity);
        setReady(true);
      }}
    />
  ) : (
    <div className="bg-grayish h-full">
      <div className="fixed bottom-10 w-full flex items-center justify-center space-x-2 z-50">
        <ToggleChatButton />
        <RaiseHandButton identityRef={identityRef} />
      </div>
      <ChatWindow />
      <div className="container mx-auto h-full py-10 flex justify-center items-center">
        <div className="w-full  aspect-w-16 aspect-h-9">
          <iframe
            src={`https://vimeo.com/event/${streamId}/embed`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
