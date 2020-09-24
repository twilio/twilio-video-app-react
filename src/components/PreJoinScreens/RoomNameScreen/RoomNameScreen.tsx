import React, { ChangeEvent, FormEvent } from 'react';
import { Typography, makeStyles, TextField, Grid, Button } from '@material-ui/core';
import { useAppState } from '../../../state';

const useStyles = makeStyles({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0',
    '& div:not(:last-child)': {
      marginRight: '0.5em',
    },
  },
});

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join a Room
      </Typography>
      <Typography variant="body1">
        {hasUsername
          ? "Enter the name of a room you'd like to join."
          : "Enter your name and the name of a room you'd like to join"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <TextField
              id="input-user-name"
              label="Your Name"
              variant="outlined"
              fullWidth
              size="small"
              value={name}
              onChange={handleNameChange}
            />
          )}

          <TextField
            id="input-room-name"
            label="Room Name"
            variant="outlined"
            fullWidth
            size="small"
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </div>
        <Grid container justify="flex-end">
          <Button variant="contained" type="submit" color="primary" disabled={!name || !roomName}>
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
