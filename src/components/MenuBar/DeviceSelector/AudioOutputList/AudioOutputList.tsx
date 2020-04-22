import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { useAppState } from '../../../../state';
import { useAudioOutputDevices } from '../hooks/hooks';

export default function AudioOutputList() {
  const audioOutputDevices = useAudioOutputDevices();
  const { activeSinkId, setActiveSinkId } = useAppState();

  return (
    <List>
      {audioOutputDevices.map(device => (
        <ListItem
          button
          key={device.deviceId}
          selected={device.deviceId === activeSinkId}
          onClick={() => setActiveSinkId(device.deviceId)}
        >
          <ListItemText>{device.label}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
