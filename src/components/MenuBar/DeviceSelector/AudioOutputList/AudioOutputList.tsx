import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
} from '@material-ui/core';
import { useAppState } from '../../../../state';
import { useAudioOutputDevices } from '../hooks/hooks';

export default function AudioOutputList() {
  const audioOutputDevices = useAudioOutputDevices();
  const { activeSinkId, setActiveSinkId } = useAppState();

  return (
    <div>
      {audioOutputDevices.length > 1 ? (
        <FormControl>
          <InputLabel id="audio-output-select">Audio Output</InputLabel>
          <Select
            labelId="audio-output-select"
            onChange={e => setActiveSinkId(e.target.value as string)}
            value={activeSinkId}
          >
            {audioOutputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <DialogContentText>Audio Input</DialogContentText>
          <DialogContentText>System Default Audio Output</DialogContentText>
        </>
      )}
    </div>
  );
}
