import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

import { getToken, receiveToken } from '../../store/main/main';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import { useVideoContext } from '../../hooks/context';

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
  })
);

export default function Menu() {
  const [name, setName] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const roomState = useRoomState();
  const dispatch = useDispatch();
  const { isConnecting } = useVideoContext();

  const classes = useStyles();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(getToken(name, roomName));
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
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isConnecting || !name || !roomName}
            >
              Join Room
            </Button>
            {isConnecting && <CircularProgress></CircularProgress>}
          </form>
        ) : (
          <Button onClick={() => dispatch(receiveToken(''))}>Leave Room</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
