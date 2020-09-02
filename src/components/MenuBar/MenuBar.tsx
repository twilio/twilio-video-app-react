import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Menu from './Menu/Menu';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid } from '@material-ui/core';
import ToggleAudioButton from '../Controls/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../Controls/ToggleVideoButton/ToggleVideoButton';
import ToggleScreenShareButton from '../Controls/ToogleScreenShareButton/ToggleScreenShareButton';
import EndCallButton from '../Controls/EndCallButton/EndCallButton';

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
      padding: '0 1em',
    },
    toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxWidth: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 1,
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
      },
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { URLRoomName } = useParams();
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect, isAcquiringLocalTracks, isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
  }, [URLRoomName]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  useEffect(() => {
    getToken(Math.random().toString(), 'roomName-473sf4hTWCn6').then(token => connect(token));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    getToken(name, roomName).then(token => connect(token));
  };

  return (
    <>
      {isSharingScreen && (
        <Grid container justify="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={classes.container}>
        {roomState === 'disconnected' ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            {window.location.search.includes('customIdentity=true') || !user?.displayName ? (
              <TextField
                id="menu-name"
                label="Name"
                className={classes.textField}
                value={name}
                onChange={handleNameChange}
                margin="dense"
              />
            ) : (
              <Typography className={classes.displayName} variant="body1">
                {user.displayName}
              </Typography>
            )}
            <TextField
              id="menu-room"
              label="Room"
              className={classes.textField}
              value={roomName}
              onChange={handleRoomNameChange}
              margin="dense"
            />
            <Button
              className={classes.joinButton}
              type="submit"
              color="primary"
              variant="contained"
              disabled={isAcquiringLocalTracks || isConnecting || !name || !roomName || isFetching}
            >
              Join Room
            </Button>
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <Grid container justify="space-around" alignItems="center">
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">{roomName}</Typography>
            </Grid>
            <Grid>
              <ToggleAudioButton disabled={isReconnecting} />
              <ToggleVideoButton disabled={isReconnecting} />
              {!isSharingScreen && <ToggleScreenShareButton disabled={isReconnecting} />}
            </Grid>
            <Grid style={{ flex: 1 }}>
              <Grid container justify="flex-end">
                <Menu />
                <EndCallButton />
              </Grid>
            </Grid>
          </Grid>
        )}
      </footer>
    </>
  );
}
