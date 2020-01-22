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
    padding: '3em 0 1.5em',
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
    background: 'white',
    marginTop: '2em',
  },
});

export default function Login() {
  const classes = useStyles();
  const { signIn } = useAppState();

  return (
    <Grid container justify="center">
      <Grid xs={3}>
        <Paper className={classes.paper} elevation={6}>
          <TwilioLogo className={classes.twilioLogo} />
          <img className={classes.videoLogo} src={videoLogo}></img>
          <Typography variant="h5">Video Collaboration App</Typography>
          <Button variant="contained" className={classes.button} onClick={signIn} startIcon={<Qqq />}>
            Continue with Google
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
