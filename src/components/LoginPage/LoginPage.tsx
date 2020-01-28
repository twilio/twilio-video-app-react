import React from 'react';
import { useAppState } from '../../state';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import { ReactComponent as TwilioLogo } from './twilio-logo.svg';
import videoLogo from './video-logo.png';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#0D122B',
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
    margin: '0.8em 0 0.7em',
    textTransform: 'none',
  },
});

export default function Login() {
  const classes = useStyles();
  const { signIn, user, isAuthReady } = useAppState();
  const history = useHistory();
  const location = useLocation<{ from: Location }>();

  const login = () => {
    signIn().then(() => {
      history.replace(location?.state?.from || { pathname: '/' });
    });
  };

  if (user || process.env.REACT_APP_USE_FIREBASE_AUTH !== 'true') {
    history.replace('/');
  }

  if (!isAuthReady) {
    return null;
  }

  return (
    <Grid container justify="center" alignItems="flex-start" className={classes.container}>
      <Paper className={classes.paper} elevation={6}>
        <TwilioLogo className={classes.twilioLogo} />
        <img className={classes.videoLogo} src={videoLogo} alt="Video Logo"></img>
        <Button variant="contained" className={classes.button} onClick={login} startIcon={<GoogleLogo />}>
          Sign in with Google
        </Button>
      </Paper>
    </Grid>
  );
}
