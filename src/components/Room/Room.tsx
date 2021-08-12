import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import MainParticipant from '../MainParticipant/MainParticipant';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import ReactPlayer from 'react-player';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';

const useStyles = makeStyles((theme: Theme) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;
  return {
    container: {
      position: 'relative',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
      gridTemplateRows: '100%',
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: `100%`,
        gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
      },
    },
    rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },
  };
});

function getQueryParams(queryString: string) {
  const sp = new URLSearchParams(queryString);

  return {
    URLRoomName: sp.get('room'),
    URLPersona: sp.get('persona'),
    URLName: sp.get('name'),
  };
}

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen } = useVideoContext();

  const participants = useParticipants();
  const { URLRoomName, URLPersona, URLName } = getQueryParams(window.location.search);
  if (participants.length === 0 && URLPersona !== 'provider')
    return (
      <div
        className={clsx(classes.container, {
          [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
        })}
      >
        <ReactPlayer
          url="https://www.youtube.com/embed/E1h2Aqr8cu8"
          width="100%"
          controls={false}
          height="100%"
          muted={false}
          loop={true}
          playing={true}
        />
        <ParticipantList />
        <ChatWindow />
      </div>
    );
  else
    return (
      <div
        className={clsx(classes.container, {
          [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
        })}
      >
        <MainParticipant />
        <ParticipantList />
        <ChatWindow />
      </div>
    );
}
