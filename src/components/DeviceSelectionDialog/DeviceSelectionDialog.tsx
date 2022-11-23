import React from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import {
  DialogContent,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  Button,
  Theme,
  DialogTitle,
  Hidden,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VideoInputList from './VideoInputList/VideoInputList';
import MaxGalleryViewParticipants from './MaxGalleryViewParticipants/MaxGalleryViewParticipants';
import { useKrispToggle } from '../../hooks/useKrispToggle/useKrispToggle';
import SmallCheckIcon from '../../icons/SmallCheckIcon';
import InfoIconOutlined from '../../icons/InfoIconOutlined';
import KrispLogo from '../../icons/KrispLogo';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '600px',
    minHeight: '400px',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100vw - 32px)',
    },
    '& .inputSelect': {
      width: 'calc(100% - 35px)',
    },
  },
  button: {
    float: 'right',
  },
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px',
    },
  },
  headline: {
    marginBottom: '1.3em',
    fontSize: '1.1rem',
  },
  listSection: {
    margin: '2em 0 0.8em',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
  },
  noiseCancellationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  krispContainer: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      '&:not(:last-child)': {
        margin: '0 0.3em',
      },
    },
  },
  krispInfoText: {
    margin: '0 0 1.5em 0.5em',
  },
}));

export default function DeviceSelectionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isAcquiringLocalTracks } = useVideoContext();
  const { isKrispEnabled, isKrispInstalled } = useAppState();
  const { toggleKrisp } = useKrispToggle();
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Audio and Video Settings</DialogTitle>
      <Divider />
      <DialogContent className={classes.container}>
        <div className={classes.listSection}>
          <Typography variant="h6" className={classes.headline}>
            Video
          </Typography>
          <VideoInputList />
        </div>
        <Divider />
        <div className={classes.listSection}>
          <Typography variant="h6" className={classes.headline}>
            Audio
          </Typography>

          {isKrispInstalled && (
            <div className={classes.noiseCancellationContainer}>
              <div className={classes.krispContainer}>
                <Typography variant="subtitle2">Noise Cancellation powered by </Typography>
                <KrispLogo />
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
                disabled={isAcquiringLocalTracks}
              />
            </div>
          )}
          {isKrispInstalled && (
            <Typography variant="body1" color="textSecondary" className={classes.krispInfoText}>
              Suppress background noise from your microphone.
            </Typography>
          )}

          <AudioInputList />
        </div>
        <div className={classes.listSection}>
          <AudioOutputList />
        </div>
        <Hidden smDown>
          <Divider />
          <div className={classes.listSection}>
            <Typography variant="h6" className={classes.headline}>
              Gallery View
            </Typography>
            <MaxGalleryViewParticipants />
          </div>
        </Hidden>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button color="primary" variant="contained" className={classes.button} onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
