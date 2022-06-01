import React, { useEffect } from 'react';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import ChatWindow from '../ChatWindow/ChatWindow';
import clsx from 'clsx';
import { GridView } from '../GridView/GridView';
import { MobileGridView } from '../MobileGridView/MobileGridView';
import MainParticipant from '../MainParticipant/MainParticipant';
import { makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { Participant, Room as IRoom } from 'twilio-video';
import { ParticipantAudioTracks } from '../ParticipantAudioTracks/ParticipantAudioTracks';
import ParticipantList from '../ParticipantList/ParticipantList';
import { useAppState } from '../../state';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
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
    rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },
  };
});

export function useSetCollaborationViewOnScreenShare(
  screenShareParticipant: Participant | undefined,
  room: IRoom | null,
  setIsGridModeActive: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    if (screenShareParticipant && screenShareParticipant !== room!.localParticipant) {
      setIsGridModeActive(false);
    }
  }, [screenShareParticipant, setIsGridModeActive, room]);
}

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen, room } = useVideoContext();
  const { isGridModeActive, setIsGridModeActive } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const screenShareParticipant = useScreenShareParticipant();

  // Here we switch to collaboration view when a participant starts sharing their screen, but
  // the user is still free to switch back to grid mode.
  useSetCollaborationViewOnScreenShare(screenShareParticipant, room, setIsGridModeActive);

  return (
    <div
      className={clsx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Grid View and Collaboration View.
      */}
      <ParticipantAudioTracks />

      {isGridModeActive ? (
        isMobile ? (
          <MobileGridView />
        ) : (
          <GridView />
        )
      ) : (
        <>
          <MainParticipant />
          <ParticipantList />
        </>
      )}

      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
