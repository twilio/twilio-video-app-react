import React from 'react';
import { makeStyles, Typography, Grid, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const handleJoin = () => {
    getToken(name, roomName).then(({ token }) => {
      videoConnect(token);
      process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
    });
  };

  if (isFetching || isConnecting) {
    return (
      <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Beitreten
          </Typography>
        </div>
      </Grid>
    );
  }

  const buttonClassName = 'rounded-full bg-white flex items-center justify-center w-12 h-12 shadow-lg';

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        {roomName} beitreten
      </Typography>

      <div className="flex flex-col items-center">
        <div className={'h-36 w-52'}>
          <LocalVideoPreview identity={name} />
        </div>
        <div className="flex items-center justify-center space-x-3">
          <ToggleAudioButton className={buttonClassName} disabled={disableButtons} />
          <ToggleVideoButton className={buttonClassName} disabled={disableButtons} />
          <SettingsMenu className={buttonClassName} />
        </div>
      </div>
      <div className={'flex space-x-5 pt-10'}>
        <button className="hover:underline font-medium" onClick={() => setStep(Steps.roomNameStep)}>
          Zurück
        </button>
        <button className="text-purple hover:underline font-medium" onClick={handleJoin} disabled={disableButtons}>
          Jetzt beitreten
        </button>
      </div>
    </>
  );
}
