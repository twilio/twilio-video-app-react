import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import SwooshBackground from './SwooshBackground';
import VideoLogo from './VideoLogo';
import TwilioLogo from './TwilioLogo';

const useStyles = makeStyles({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(40, 42, 43)',
    height: '100vh',
  },
  container: {
    display: 'flex',
    width: '888px',
    height: '379px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
  },
  swooshContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    width: '210px',
    textAlign: 'center',
  },
  twilioLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '4em',
  },
  title: {
    color: 'white',
    margin: '1em 0 0',
  },
});

const IntroContainer: React.FC = props => {
  const classes = useStyles();

  return (
    <main className={classes.background}>
      <TwilioLogo className={classes.twilioLogo} />
      <div className={classes.container}>
        <div className={classes.swooshContainer}>
          <SwooshBackground />
          <div className={classes.logoContainer}>
            <VideoLogo />
            <Typography variant="h6" className={classes.title}>
              Twilio Programmable Video
            </Typography>
          </div>
        </div>
        <div className={classes.content}>{props.children}</div>
      </div>
    </main>
  );
};

export default IntroContainer;
