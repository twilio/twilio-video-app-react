import React, { useEffect, useRef } from 'react';
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

/**
 * This hook turns on presentation view when screensharing is active, regardless of if the
 * user was already using presentation view or grid view. Once screensharing has ended, the user's
 * view will return to whatever they were using prior to screenshare starting.
 */

export function useSetPresentationViewOnScreenShare(
  screenShareParticipant: Participant | undefined,
  room: IRoom | null,
  setIsGridModeActive: React.Dispatch<React.SetStateAction<boolean>>,
  isGridModeActive: boolean
) {
  const isGridViewActiveRef = useRef(isGridModeActive);

  // Save the user's view setting whenever they change to presentation view or grid view:
  useEffect(() => {
    isGridViewActiveRef.current = isGridModeActive;
  }, [isGridModeActive]);

  useEffect(() => {
    if (screenShareParticipant && screenShareParticipant !== room!.localParticipant) {
      // When screensharing starts, save the user's previous view setting (presentation or grid):
      const prevIsGridViewActive = isGridViewActiveRef.current;
      // Turn off grid view so that the user can see the screen that is being shared:
      setIsGridModeActive(false);
      return () => {
        // If the user was using grid view prior to screensharing, turn grid view back on
        // once screensharing stops:
        if (prevIsGridViewActive) {
          setIsGridModeActive(prevIsGridViewActive);
        }
      };
    }
  }, [screenShareParticipant, setIsGridModeActive, room]);
}

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen, room } = useVideoContext();
  const { isGridViewActive, setIsGridViewActive } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const screenShareParticipant = useScreenShareParticipant();

  // Here we switch to presentation view when a participant starts sharing their screen, but
  // the user is still free to switch back to grid view.
  useSetPresentationViewOnScreenShare(screenShareParticipant, room, setIsGridViewActive, isGridViewActive);

  return (
    <div
      className={clsx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Grid View and presentation View.
      */}
      <ParticipantAudioTracks />

      {isGridViewActive ? (
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
