import React, { ChangeEvent, useState, FormEvent } from 'react';
import { useAppState } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import { ReactComponent as TwilioLogo } from './twilio-logo.svg';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import videoLogo from './video-logo.png';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
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
    maxWidth: '460px',
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
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

export default function LoginPage() {
  const classes = useStyles();
  const { signIn, user, isAuthReady } = useAppState();
  const history = useHistory();
  const location = useLocation<{ from: Location }>();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);

  const isAuthEnabled = Boolean(process.env.REACT_APP_SET_AUTH);

  const login = () => {
    setAuthError(null);
    signIn?.(passcode)
      .then(() => {
        history.replace(location?.state?.from || { pathname: '/' });
      })
      .catch(err => setAuthError(err));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  if (user || !isAuthEnabled) {
    history.replace('/');
  }

  if (!isAuthReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <Paper className={classes.paper} elevation={6}>
          <TwilioLogo className={classes.twilioLogo} />
          <img className={classes.videoLogo} src={videoLogo} alt="Video Logo"></img>

          {process.env.REACT_APP_SET_AUTH === 'firebase' && (
            <Button variant="contained" className={classes.button} onClick={login} startIcon={<GoogleLogo />}>
              Sign in with Google
            </Button>
          )}

          {process.env.REACT_APP_SET_AUTH === 'passcode' && (
            <form onSubmit={handleSubmit}>
              <Grid container alignItems="center" direction="column">
                <TextField
                  id="input-passcode"
                  label="Passcode"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasscode(e.target.value)}
                  type="password"
                />
                <div>
                  {authError && (
                    <Typography variant="caption" className={classes.errorMessage}>
                      <ErrorOutlineIcon />
                      {authError.message}
                    </Typography>
                  )}
                </div>
                <Button variant="contained" className={classes.button} type="submit" disabled={!passcode.length}>
                  Submit
                </Button>
              </Grid>
            </form>
          )}
        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
