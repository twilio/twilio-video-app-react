import React from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden, Switch, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useKrispToggle } from '../../../hooks/useKrispToggle/useKrispToggle';
import SmallCheckIcon from '../../../icons/SmallCheckIcon';
import InfoIconOutlined from '../../../icons/InfoIconOutlined';

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
    marginBottom: '2em',
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
  toolTipContainer: {
    display: 'flex',
    alignItems: 'center',
    '& div': {
      display: 'flex',
      alignItems: 'center',
    },
    '& svg': {
      marginLeft: '0.3em',
    },
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching, isKrispEnabled, isKrispInstalled } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const { toggleKrisp } = useKrispToggle();
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
            Joining Meeting
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName}
      </Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
              <SettingsMenu mobileButtonClass={classes.mobileButton} />
            </Hidden>
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="space-between" style={{ alignItems: 'normal' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          {isKrispInstalled && (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: '1em' }}
            >
              <div className={classes.toolTipContainer}>
                <Typography variant="subtitle2">Noise Cancellation</Typography>
                <Tooltip
                  title="Suppress background noise from your microphone"
                  interactive
                  leaveDelay={250}
                  leaveTouchDelay={15000}
                  enterTouchDelay={0}
                >
                  <div>
                    <InfoIconOutlined />
                  </div>
                </Tooltip>
              </div>

              <FormControlLabel
                control={
                  <Switch
                    checked={!!isKrispEnabled}
                    checkedIcon={<SmallCheckIcon />}
                    disableRipple={true}
                    onClick={toggleKrisp}
                  />
                }
                label={isKrispEnabled ? 'Enabled' : 'Disabled'}
                style={{ marginRight: 0 }}
                // Prevents <Switch /> from being temporarily enabled (and then quickly disabled) in unsupported browsers after
                // isAcquiringLocalTracks becomes false:
                disabled={isKrispEnabled && isAcquiringLocalTracks}
              />
            </Grid>
          )}
          <Divider />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <Grid container direction="row" alignItems="center" style={{ marginTop: '1em' }}>
            <Hidden smDown>
              <Grid item md={7} sm={12} xs={12}>
                <SettingsMenu mobileButtonClass={classes.mobileButton} />
              </Grid>
            </Hidden>

            <Grid item md={5} sm={12} xs={12}>
              <div className={classes.joinButtons}>
                <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  data-cy-join-now
                  onClick={handleJoin}
                  disabled={disableButtons}
                >
                  Join Now
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
