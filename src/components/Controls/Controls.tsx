import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useRoomState from '../../hooks/useRoomState/useRoomState';

import { useDispatch } from 'react-redux';
import { receiveToken } from '../../store/main/main';
import useScreenShareToggle from '../../hooks/useScreenShareToggle/useScreenShareToggle';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import { useVideoContext } from '../../hooks/context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    container: {
      position: 'absolute',
      right: '50%',
      transform: 'translateX(50%)',
      bottom: '50px',
      zIndex: 1,
    },
  })
);

export default function Controls() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const [isScreenShared, toggleScreenShare] = useScreenShareToggle();
  const roomState = useRoomState();
  const screenShareParticipant = useScreenShareParticipant();
  const { room } = useVideoContext();
  const disableScreenShareButton = screenShareParticipant && screenShareParticipant !== room.localParticipant;

  return (
    <div className={classes.container}>
      <Tooltip
        title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <Fab className={classes.fab} onClick={toggleAudioEnabled}>
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </Fab>
      </Tooltip>
      <Tooltip
        title={isVideoEnabled ? 'Mute Video' : 'Unmute Video'}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <Fab className={classes.fab} onClick={toggleVideoEnabled}>
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </Fab>
      </Tooltip>
      {roomState === 'connected' && (
        <>
          {navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && (
            <Tooltip
              title={isScreenShared ? 'Stop Screen Sharing' : 'Share Screen'}
              placement="top"
              PopperProps={{ disablePortal: true }}
            >
              <Fab className={classes.fab} onClick={toggleScreenShare} disabled={disableScreenShareButton}>
                {isScreenShared ? <StopScreenShare /> : <ScreenShare />}
              </Fab>
            </Tooltip>
          )}
          <Tooltip
            title={'End Call'}
            onClick={() => dispatch(receiveToken(''))}
            placement="top"
            PopperProps={{ disablePortal: true }}
          >
            <Fab className={classes.fab} color="primary">
              <CallEnd />
            </Fab>
          </Tooltip>
        </>
      )}
    </div>
  );
}
