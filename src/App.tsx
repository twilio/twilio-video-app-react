import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';

import './index.css';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import useSessionContext from 'hooks/useSessionContext';
import { UserGroup } from 'types';
import { setSessionModerator } from 'utils/firebase/session';
import useRoomState from 'hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

export default function App() {
  const { groupToken, userGroup } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const roomState = useRoomState();

  useEffect(() => {
    if (groupToken && userGroup === UserGroup.Moderator && localParticipant) {
      setSessionModerator(groupToken, localParticipant.sid);
    }
  }, [localParticipant]);

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
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
  );
}
