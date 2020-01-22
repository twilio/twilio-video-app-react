import React from 'react';
import { useAppState } from '../../state';

import makeStyles from '@material-ui/core//styles/makeStyles';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { ReactComponent as Qqq } from './google-logo.svg';
import { ReactComponent as TwilioLogo } from './twilio-logo.svg';
import videoLogo from './video-logo.png';

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
  twilioLogo: {
    width: '55%',
    display: 'block',
  },
  videoLogo: {
    width: '25%',
    padding: '2.4em 0 2.1em',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '2em',
    marginTop: '4em',
    background: 'white',
    color: 'black',
  },
  button: {
    color: 'black',
    background: 'white',
    marginTop: '2em',
    textTransform: 'none',
  },
});

export default function Login() {
  const classes = useStyles();
  const { signIn } = useAppState();

  return (
    <Grid container justify="center">
      <Paper className={classes.paper} elevation={6}>
        <TwilioLogo className={classes.twilioLogo} />
        <img className={classes.videoLogo} src={videoLogo}></img>
        <Typography variant="h5">Video Collaboration App</Typography>
        <Button variant="contained" color="primary" className={classes.button} onClick={signIn} startIcon={<Qqq />}>
          Sign in with Google
        </Button>
      </Paper>
    </Grid>
  );
}
