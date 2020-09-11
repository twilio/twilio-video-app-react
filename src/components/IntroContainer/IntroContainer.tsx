import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import SwooshBackground from './SwooshBackground';
import VideoLogo from './VideoLogo';
import TwilioLogo from './TwilioLogo';
import { useAppState } from '../../state';
import UserMenu from './UserMenu/UserMenu';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(40, 42, 43)',
    height: '100vh',
  },
  container: {
    position: 'relative',
  },
  innerContainer: {
    display: 'flex',
    width: '888px',
    height: '379px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
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
  subContentContainer: {
    position: 'absolute',
    marginTop: '1em',
    width: '100%',
  },
});

interface IntroContainerProps {
  children: React.ReactNode;
  subContent?: React.ReactNode;
}

const IntroContainer = (props: IntroContainerProps) => {
  const classes = useStyles();
  const { user } = useAppState();
  const location = useLocation();

  return (
    <div className={classes.background}>
      <TwilioLogo className={classes.twilioLogo} />
      {user && location.pathname !== '/login' && <UserMenu />}
      <div className={classes.container}>
        <div className={classes.innerContainer}>
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
        {props.subContent && <div className={classes.subContentContainer}>{props.subContent}</div>}
      </div>
    </div>
  );
};

export default IntroContainer;
