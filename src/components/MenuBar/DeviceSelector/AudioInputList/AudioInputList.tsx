import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import LocalAudioLevelIndicator from '../LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { makeStyles } from '@material-ui/core/styles';
import { useAudioInputDevices } from '../deviceHooks/deviceHooks';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});

export default function AudioInputList() {
  const classes = useStyles();
  const audioInputDevices = useAudioInputDevices();
  const { localTracks } = useVideoContext();

  const localAudioTrack = localTracks.find(track => track.kind === 'audio');
  const [localAudioInputDeviceId, setLocalAudioInputDeviceId] = useState(
    localAudioTrack?.mediaStreamTrack.getSettings().deviceId
  );

  useEffect(() => {
    const handleStarted = () => setLocalAudioInputDeviceId(localAudioTrack?.mediaStreamTrack.getSettings().deviceId);
    localAudioTrack?.on('started', handleStarted);
    return () => {
      localAudioTrack?.on('started', handleStarted);
    };
  }, [localAudioTrack]);

  function replaceTrack(newDeviceId: string) {
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <div className={classes.container}>
      <div className="inputSelect">
        {audioInputDevices.length > 1 ? (
          <FormControl fullWidth>
            <Typography variant="h6">Audio Input:</Typography>
            <Select onChange={e => replaceTrack(e.target.value as string)} value={localAudioInputDeviceId || ''}>
              {audioInputDevices.map(device => (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <>
            <Typography variant="h6">Audio Input:</Typography>
            <Typography>{localAudioTrack?.mediaStreamTrack.label || 'No Local Audio'}</Typography>
          </>
        )}
      </div>
      <LocalAudioLevelIndicator />
    </div>
  );
}
