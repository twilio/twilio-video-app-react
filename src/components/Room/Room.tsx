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
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import { checkPatient } from './RoomUtils';
import ToggleVideoButton from '../Buttons/ToggleVideoButton/ToggleVideoButton';

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

const useWRStyles = makeStyles((theme: Theme) => {
  return {
    banner: {
      color: 'black',
      fontWeight: 'bold',
      gridRow: '1',
      gridColumn: '2 / 4',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    footer: {
      color: 'black',
      gridRow: '5',
      gridColumn: '2 / 4',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      flexDirection: 'column',
    },
    controls: {
      gridRow: '4 / 5',
      gridColumn: '3 / 4',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'column',
    },
    button: {
      border: '1px solid black',
      width: '90%',
    },
    buttonDisconnect: {
      border: 'none',
      width: '90%',
    },
    patientBlock: {
      gridRow: '4 / 5',
      gridColumn: '2 / 4',
      backgroundColor: 'lightgray',
      border: '1px solid black',
    },
    patient: {
      gridRow: '4 / 5',
      gridColumn: '2 / 3',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    player: {
      gridRow: '2 / 3',
      gridColumn: '2 / 4',
    },
    containerWR: {
      backgroundColor: 'white',
      display: 'grid',
      gridTemplate: '7% 45% 5% 35% 8% / 1fr 300px 215px 1fr',
      height: '100%',
      [theme.breakpoints.down('sm')]: {
        gridTemplate: '10% 40% 8% 30% 12% / 1fr 235px 185px 1fr',
      },
      [theme.breakpoints.down('xs')]: {
        gridTemplate: '15% 40% 10% 30% 15%/ 2% 53% 43% 2%',
      },
    },
  };
});

export default function Room() {
  const classes = useStyles();
  const classesWR = useWRStyles();

  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen, room } = useVideoContext();

  const participants = useParticipants();
  const isPatient = checkPatient();
  const localParticipant = room!.localParticipant;

  if (participants.length === 0 && isPatient)
    return (
      <div className={clsx(classesWR.containerWR)}>
        <div className={clsx(classesWR.banner)}>Virtual Waiting Room</div>
        <ReactPlayer
          className={clsx(classesWR.player)}
          url="https://www.youtube.com/embed/E1h2Aqr8cu8"
          controls={false}
          width={'100%'}
          height={'100%'}
          muted={false}
          loop={true}
          playing={false}
        />
        <div className={clsx(classesWR.patientBlock)}></div>
        <div className={clsx(classesWR.patient)}>
          {/*<Participant participant={localParticipant} isLocalParticipant={true} hideParticipant={false} />*/}
          <ParticipantList />
        </div>

        <div className={clsx(classesWR.controls)}>
          <ToggleAudioButton className={clsx(classesWR.button)} />
          <ToggleVideoButton className={clsx(classesWR.button)} />
          <EndCallButton className={clsx(classesWR.buttonDisconnect)} />
        </div>

        <div className={clsx(classesWR.footer)}>
          You are in the waiting room. Your provider will be joining shortly.
        </div>
      </div>
    );
  return (
    <div
      className={clsx(classes.container, {
        [classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      <MainParticipant />
      <ParticipantList />
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
