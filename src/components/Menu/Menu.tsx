import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from '../ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';

import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    form: {
      display: 'flex',
      alignItems: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
  })
);

export function getRoomName() {
  const match = window.location.pathname.match(/^\/room\/([^/]*)/);
  return match ? window.decodeURI(match[1]) : '';
}

export default function Menu() {
  const [name, setName] = useState<string>('');
  const [roomName, setRoomName] = useState<string>(getRoomName());
  const roomState = useRoomState();
  const { isConnecting } = useVideoContext();
  const { getToken } = useAppState();

  const classes = useStyles();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}`));
    getToken(name, roomName);
  };

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        {roomState === 'disconnected' ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              id="menu-name"
              label="Name"
              className={classes.textField}
              value={name}
              onChange={handleNameChange}
              margin="dense"
            />
            <TextField
              id="menu-room"
              label="Room"
              className={classes.textField}
              value={roomName}
              onChange={handleRoomNameChange}
              margin="dense"
            />
            <Button type="submit" color="primary" variant="contained" disabled={isConnecting || !name || !roomName}>
              Join Room
            </Button>
            {isConnecting && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <h3>{roomName}</h3>
        )}
        <ToggleFullscreenButton />
      </Toolbar>
    </AppBar>
  );
}
