import React from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { useAppState } from '../../../../state';
import { useAudioOutputDevices } from '../deviceHooks/deviceHooks';

export default function AudioOutputList() {
  const audioOutputDevices = useAudioOutputDevices();
  const { activeSinkId, setActiveSinkId } = useAppState();
  const activeOutputLabel = audioOutputDevices.find(device => device.deviceId === activeSinkId)?.label;

  return (
    <div className="inputSelect">
      {audioOutputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="h6">Audio Output:</Typography>
          <Select onChange={e => setActiveSinkId(e.target.value as string)} value={activeSinkId}>
            {audioOutputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="h6">Audio Output:</Typography>
          <Typography>{activeOutputLabel || 'System Default Audio Output'}</Typography>
        </>
      )}
    </div>
  );
}
