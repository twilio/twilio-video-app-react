import React, { useCallback } from 'react';
import {
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { labels, Settings } from '../../../state/settings/settingsReducer';
import { useAppState } from '../../../state';
import useRoomState from '../../../hooks/useRoomState/useRoomState';

const useStyles = makeStyles({
  formControl: {
    display: 'block',
    margin: '1.5em 0.6em',
  },
});

const withDefault = (val?: string) => (typeof val === 'undefined' ? 'default' : val);

const RenderDimensions = [
  <MenuItem key="low" value="low">
    Low (160 x 90)
  </MenuItem>,
  <MenuItem key="standard" value="standard">
    Standard (1280 x 720)
  </MenuItem>,
  <MenuItem key="high" value="high">
    High (1920 x 1080)
  </MenuItem>,
  <MenuItem key="default" value="default">
    Server Default
  </MenuItem>,
];

export default function ConnectionOptions() {
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
    <DialogContent>
      <Grid container>
        <Typography hidden={!isDisabled} variant="body2">
          These settings can only be changed when not connectd to a room.
        </Typography>
        <Grid item sm={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id={labels.dominantSpeakerPriority}>Dominant Speaker Priority:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={labels.dominantSpeakerPriority}
              label={labels.dominantSpeakerPriority}
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
            <InputLabel id={labels.trackSwitchOffMode}>Track Switch Off Mode:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={labels.trackSwitchOffMode}
              label={labels.trackSwitchOffMode}
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
            <InputLabel id={labels.bandwidthProfileMode}>Mode:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={labels.bandwidthProfileMode}
              label={labels.bandwidthProfileMode}
              value={withDefault(settings.bandwidthProfileMode)}
              onChange={handleChange}
            >
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="collaboration">Collaboration</MenuItem>
              <MenuItem value="presentation">Presentation</MenuItem>
              <MenuItem value="default">Server Default</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              disabled={isDisabled}
              fullWidth
              id={labels.maxTracks}
              label="Max Tracks"
              name={labels.maxTracks}
              value={withDefault(settings.maxTracks)}
              onChange={handleNumberChange}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              disabled={isDisabled}
              fullWidth
              id={labels.maxAudioBitrate}
              label="Audio Bitrate"
              name={labels.maxAudioBitrate}
              value={withDefault(settings.maxAudioBitrate)}
              onChange={handleNumberChange}
            />
          </FormControl>
        </Grid>

        <Grid item sm={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id={labels.renderDimensionLow}>Low:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={labels.renderDimensionLow}
              label={labels.renderDimensionLow}
              value={withDefault(settings.renderDimensionLow)}
              onChange={handleChange}
            >
              {RenderDimensions}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id={labels.renderDimensionStandard}>Standard:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={labels.renderDimensionStandard}
              label={labels.renderDimensionStandard}
              value={withDefault(settings.renderDimensionStandard)}
              onChange={handleChange}
            >
              {RenderDimensions}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id={labels.renderDimensionHigh}>High:</InputLabel>
            <Select
              fullWidth
              disabled={isDisabled}
              name={labels.renderDimensionHigh}
              label={labels.renderDimensionHigh}
              value={withDefault(settings.renderDimensionHigh)}
              onChange={handleChange}
            >
              {RenderDimensions}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </DialogContent>
  );
}
