import React, { useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';

import './index.css';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import useSessionContext from 'hooks/useSessionContext';
import { UserGroup } from 'types';
import { addSessionModerator, subscribeToSessionStore } from 'utils/firebase/session';
import useRoomState from 'hooks/useRoomState/useRoomState';
import { PopupScreen } from './components/PopupScreen';
import { AudienceLayout } from 'components/Layouts/AudienceLayout';
import { unsubscribeFromCarouselGame } from 'utils/firebase/game';
import { getUid } from 'utils/firebase/base';
import { uidFromIdentity } from 'utils/participants';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

export default function App() {
  const { groupToken, userGroup } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const roomState = useRoomState();
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    const subId = 'BASE_APP';
    if (groupToken) {
      subscribeToSessionStore(subId, groupToken, store => {
        let banned = store.data.banned ?? [];
        getUid().then(uid => {
          setBanned(banned.some(identity => uidFromIdentity(identity) === uid));
        });
      });
    }

    return () => {
      unsubscribeFromCarouselGame(subId);
    };
  }, []);

  useEffect(() => {
    if (groupToken && userGroup === UserGroup.Moderator && localParticipant) {
      addSessionModerator(groupToken, localParticipant.sid);
    }
  }, [localParticipant]);

  if (banned) {
    if (room) {
      room.disconnect();
    }

    return (
      <div className="flex items-center justify-center w-full h-full">
        <PopupScreen>
          <h1 className="text-lg text-center">
            Du wurdest aus dem Raum ausgeschlossen! Wenn du dich ungerecht behandelt fühlst, wende dich an einen
            Moderator.
          </h1>
        </PopupScreen>
      </div>
    );
  }

  if (userGroup == UserGroup.Audience) {
    return <AudienceLayout />;
  }

  return (
    <>
      <div className="hidden w-full h-full md:block">
        <Container>
          {roomState === 'disconnected' ? (
            <PreJoinScreens />
          ) : (
            <div className="flex flex-col w-full h-full">
              <ReconnectingNotification />
              <RecordingNotifications />
              <div className="flex flex-col h-screen space-y-2 bg-grayish">
                {/* <MobileTopMenuBar /> */}
                <div className="flex-grow w-full">
                  <Room />
                </div>
                <MenuBar />
              </div>
            </div>
          )}
        </Container>
      </div>
      <div className="md:hidden flex items-center justify-center w-full h-full">
        <PopupScreen>
          <h1 className="text-lg text-center">
            Bitte nutze dein Tablet oder Desktop für die Teilnahme am DemokraTisch.
          </h1>
        </PopupScreen>
      </div>
    </>
  );
}
