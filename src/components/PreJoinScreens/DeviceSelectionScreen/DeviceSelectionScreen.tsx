import React from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
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
  joinButton: {
    border: 'none',
    flex: '1 1 0px',
    margin: '1px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  cancelButton: {
    border: '1px solid gray',
    flex: '1 1 0px',
    margin: '1px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    alignItems: 'center',
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

function getParticipantCount(roomName: string) {
  const endpoint = `get-room-participant-count?roomName=${roomName}`;
  console.log('endpoint:', endpoint);

  let responseData = null;
  fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => {
      console.log('response:', response);
      response.json();
    })
    .then(data => {
      console.log('data:', data);
      responseData = data;
    })
    .catch(error => {
      console.log(error);
    });

  console.log('responseData:', responseData);
  return responseData;

  // # inside then
  // setTimeout(getParticipantCount, 5);
  // if # > 0 then dont recursion
}

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  persona: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, persona, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  // Initial state for the number of people in the room
  const [peopleInTheRoom, setPeopleInTheRoom] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      return fetch(`get-room-participant-count?roomName=${roomName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async res => {
          const peopleCountRes = await res.json();
          if (peopleCountRes.count > 0) {
            setPeopleInTheRoom(peopleCountRes.count);
            // Clear interval when we see a participant in the room
            clearInterval(interval);
          }
        })
        .catch(err => {
          // for running locally
          setPeopleInTheRoom(0);
        });
      // Every 5 seconds
    }, 3000);
    // Clear interval when component unbounds
    return () => clearInterval(interval);
  }, [roomName]);

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
            Joining Meeting
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName} ({persona})
      </Typography>
      {persona === 'provider' && peopleInTheRoom === 0 && (
        <Typography className={classes.gutterBottom} style={{ color: 'darkgreen' }}>
          Patient has not yet joined
        </Typography>
      )}
      {persona === 'provider' && peopleInTheRoom > 0 && (
        <Typography className={classes.gutterBottom} style={{ color: 'darkred' }}>
          Patient is in the waiting room
        </Typography>
      )}
      {persona === 'patient' && peopleInTheRoom === 0 && (
        <Typography className={classes.gutterBottom} style={{ color: 'darkgreen' }}>
          Your provider will be joining shortly, please join the waiting room
        </Typography>
      )}
      {persona === 'patient' && peopleInTheRoom > 0 && (
        <Typography className={classes.gutterBottom} style={{ color: 'darkred' }}>
          Your provider is waiting. Please join the video room immediately
        </Typography>
      )}

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: '100%' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              {persona === 'provider' && (
                <Button
                  className={classes.cancelButton}
                  variant="outlined"
                  color="primary"
                  onClick={() => setStep(Steps.roomNameStep)}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButtons}
                className={classes.joinButton}
              >
                {persona === 'patient' && peopleInTheRoom === 0 && 'Join Waiting Room'}
                {persona === 'patient' && peopleInTheRoom > 0 && 'Join ' + roomName}
                {persona !== 'patient' && 'Join Now'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
