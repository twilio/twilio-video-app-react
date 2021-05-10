import React, { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { inputLabels, Settings } from '../../state/settings/settingsReducer';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';

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
  formControl: {
    display: 'block',
    margin: '1.5em 0',
    '&:first-child': {
      margin: '0 0 1.5em 0',
    },
  },
  label: {
    width: '133%', // Labels have scale(0.75) applied to them, so this effectively makes the width 100%
  },
}));

const withDefault = (val?: string) => (typeof val === 'undefined' ? 'default' : val);

export default function ConnectionOptionsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const classes = useStyles();
  const { settings, dispatchSetting } = useAppState();
  const roomState = useRoomState();
  const isDisabled = roomState !== 'disconnected';

  const handleChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown; name?: string }>) => {
      dispatchSetting({ name: e.target.name as keyof Settings, value: e.target.value as string });
    },
    [dispatchSetting]
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown; name?: string }>) => {
      if (!/[^\d]/.test(e.target.value as string)) handleChange(e);
    },
    [handleChange]
  );

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Connection Settings</DialogTitle>
      <Divider />
      <DialogContent className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography hidden={!isDisabled} variant="body2">
              These settings cannot be changed when connected to a room.
            </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id={inputLabels.dominantSpeakerPriority}>Dominant Speaker Priority:</InputLabel>
              <Select
                fullWidth
                disabled={isDisabled}
                name={inputLabels.dominantSpeakerPriority}
                label={inputLabels.dominantSpeakerPriority}
                value={withDefault(settings.dominantSpeakerPriority)}
                onChange={handleChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="default">Server Default</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id={inputLabels.trackSwitchOffMode}>Track Switch Off Mode:</InputLabel>
              <Select
                fullWidth
                disabled={isDisabled}
                name={inputLabels.trackSwitchOffMode}
                label={inputLabels.trackSwitchOffMode}
                value={withDefault(settings.trackSwitchOffMode)}
                onChange={handleChange}
              >
                <MenuItem value="predicted">Predicted</MenuItem>
                <MenuItem value="detected">Detected</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
                <MenuItem value="default">Server Default</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id={inputLabels.bandwidthProfileMode}>Mode:</InputLabel>
              <Select
                fullWidth
                disabled={isDisabled}
                name={inputLabels.bandwidthProfileMode}
                label={inputLabels.bandwidthProfileMode}
                value={withDefault(settings.bandwidthProfileMode)}
                onChange={handleChange}
              >
                <MenuItem value="grid">Grid</MenuItem>
                <MenuItem value="collaboration">Collaboration</MenuItem>
                <MenuItem value="presentation">Presentation</MenuItem>
                <MenuItem value="default">Server Default</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id={inputLabels.clientTrackSwitchOffControl}>Client Track Switch Off Control:</InputLabel>
              <Select
                fullWidth
                disabled={isDisabled}
                name={inputLabels.clientTrackSwitchOffControl}
                label={inputLabels.clientTrackSwitchOffControl}
                value={withDefault(settings.clientTrackSwitchOffControl)}
                onChange={handleChange}
              >
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id={inputLabels.contentPreferencesMode}>Content Preferences Mode:</InputLabel>
              <Select
                fullWidth
                disabled={isDisabled}
                name={inputLabels.contentPreferencesMode}
                label={inputLabels.contentPreferencesMode}
                value={withDefault(settings.contentPreferencesMode)}
                onChange={handleChange}
              >
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <TextField
                disabled={isDisabled}
                fullWidth
                id={inputLabels.maxAudioBitrate}
                label="Max Audio Bitrate"
                placeholder="Leave blank for no limit"
                name={inputLabels.maxAudioBitrate}
                value={withDefault(settings.maxAudioBitrate)}
                onChange={handleNumberChange}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button className={classes.button} color="primary" variant="contained" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
