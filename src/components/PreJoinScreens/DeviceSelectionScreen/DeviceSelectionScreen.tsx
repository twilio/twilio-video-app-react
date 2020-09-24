import React from 'react';
import { makeStyles, Typography, Grid, Button } from '@material-ui/core';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../MenuBar/Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../MenuBar/Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles({
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
  },
});

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { connect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const handleJoin = () => {
    getToken(name, roomName).then(token => connect(token));
  };

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName}
      </Typography>

      <Grid container spacing={2} justify="center">
        <Grid item sm={7} xs={10}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <SettingsMenu />
        </Grid>
        <Grid item sm={5}>
          <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
            <div>
              <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
            </div>
            <Grid container justify="space-between">
              <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleJoin} disabled={disableButtons}>
                Join Now
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
