import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import MainParticipant from '../MainParticipant/MainParticipant';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

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
    chatWindowOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.chatWindowWidth}px` },
    backgroundSelectionOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px 20vw` },
  };
});

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { backgroundSelectionOpen } = useVideoContext();
  return (
    <div
      className={clsx(classes.container, {
        [classes.chatWindowOpen]: isChatWindowOpen,
        [classes.backgroundSelectionOpen]: backgroundSelectionOpen,
      })}
    >
      <MainParticipant />
      <ParticipantList />
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
