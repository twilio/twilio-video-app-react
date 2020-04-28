import React from 'react';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';
import { useAudioInputDevices } from '../hooks/hooks';
import LocalAudioLevelIndicator from '../../LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { DialogTitle, Select, MenuItem, FormControl, InputLabel, DialogContentText } from '@material-ui/core';

export default function AudioInputList() {
  const audioInputDevices = useAudioInputDevices();
  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
  } = useVideoContext();
  const localAudioTrack = localTracks.find(track => track.kind === 'audio');
  const localAudioInputDeviceId = localAudioTrack?.mediaStreamTrack.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    if (localAudioTrack) {
      localAudioTrack.on('stopped', () => {
        getLocalAudioTrack(newDeviceId).then(newTrack => {
          localParticipant?.publishTrack(newTrack);
        });
      });
      localAudioTrack.stop();
      const localTrackPublication = localParticipant?.unpublishTrack(localAudioTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant?.emit('trackUnpublished', localTrackPublication);
    }
  }

  return (
    <div>
      {audioInputDevices.length > 1 ? (
        <FormControl>
          <InputLabel id="audio-input-select">Audio Input</InputLabel>
          <Select
            labelId="audio-input-select"
            onChange={e => replaceTrack(e.target.value as string)}
            value={localAudioInputDeviceId || ''}
          >
            {audioInputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <DialogContentText>Audio Input</DialogContentText>
          <DialogContentText>{localAudioTrack?.mediaStreamTrack.label}</DialogContentText>
        </>
      )}
      <LocalAudioLevelIndicator />
    </div>
  );
}
