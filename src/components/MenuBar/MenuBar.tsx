import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import watchRTC from '@testrtc/watchrtc-sdk';

import Button from '@material-ui/core/Button';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import NailUpEndCallButton from '../Buttons/NailUpEndCallButton/NailUpEndCallButton';
import NailUpJoinCallButton from '../Buttons/NailUpJoinCallButton/NailUpJoinCallButton';
import FlipCameraButton from './FlipCameraButton/FlipCameraButton';
import Menu from './Menu/Menu';

import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid, Hidden } from '@material-ui/core';
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../Buttons/ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from '../Buttons/ToogleScreenShareButton/ToggleScreenShareButton';
import ToggleStatsButton from '../Buttons/ToggleStatsButton/ToggleStatsButton';
import ConnectWSButton from '../Buttons/ConnectWSButton/ConnectWSButton';
import DisconnectWSButton from '../Buttons/DisconnectWSButton/DisconnectWSButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      bottom: 0,
      left: 0,
      right: 0,
      height: `${theme.footerHeight}px`,
      position: 'fixed',
      display: 'flex',
      padding: '0 1.43em',
      zIndex: 10,
      [theme.breakpoints.down('sm')]: {
        height: `${theme.mobileFooterHeight}px`,
        padding: 0,
      },
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 10,
      bottom: `${theme.footerHeight}px`,
      left: 0,
      right: 0,
      height: '104px',
      background: 'rgba(0, 0, 0, 0.5)',
      '& h6': {
        color: 'white',
      },
      '& button': {
        background: 'white',
        color: theme.brand,
        border: `2px solid ${theme.brand}`,
        margin: '0 2em',
        '&:hover': {
          color: '#600101',
          border: `2px solid #600101`,
          background: '#FFE9E7',
        },
      },
    },
    hideMobile: {
      display: 'initial',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';
  const { room } = useVideoContext();

  const handleStopSharing = () => {
    toggleScreenShare();
    watchRTC.addEvent({ type: 'local', name: 'Stop Sharing' });
  };

  return (
    <>
      {isSharingScreen && (
        <Grid container justifyContent="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => handleStopSharing()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={classes.container}>
        <Grid container justifyContent="space-around" alignItems="center">
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">{room.name}</Typography>
            </Grid>
          </Hidden>
          <Grid item>
            <Grid container justifyContent="center">
              <ToggleAudioButton disabled={isReconnecting} />
              <ToggleVideoButton disabled={isReconnecting} />
              <Hidden smDown>{!isSharingScreen && <ToggleScreenShareButton disabled={isReconnecting} />}</Hidden>
              <FlipCameraButton />
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Grid container justifyContent="flex-end">
                <Menu />
                <EndCallButton />
                <NailUpEndCallButton />
                <NailUpJoinCallButton />
                <ToggleStatsButton />
                <ConnectWSButton />
                <DisconnectWSButton />
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </footer>
    </>
  );
}
