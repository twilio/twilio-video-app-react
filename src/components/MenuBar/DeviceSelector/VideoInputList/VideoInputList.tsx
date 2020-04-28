import React from 'react';
import { useVideoInputDevices } from '../hooks/hooks';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';
import { FormControl, InputLabel, Select, MenuItem, DialogContentText } from '@material-ui/core';

import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../../../VideoTrack/VideoTrack';

export default function VideoInputList() {
  const videoInputDevices = useVideoInputDevices();
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
  } = useVideoContext();

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack;
  const localVideoInputDeviceId = localVideoTrack?.mediaStreamTrack.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    if (localVideoTrack) {
      localVideoTrack.on('stopped', () => {
        getLocalVideoTrack(newDeviceId).then(newTrack => {
          localParticipant?.publishTrack(newTrack);
        });
      });
      localVideoTrack.stop();
      const localTrackPublication = localParticipant?.unpublishTrack(localVideoTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant?.emit('trackUnpublished', localTrackPublication);
    }
  }

  return (
    <div>
      {videoInputDevices.length > 1 ? (
        <FormControl>
          <InputLabel id="video-input-select">Video Input</InputLabel>
          <Select
            labelId="video-input-select"
            onChange={e => replaceTrack(e.target.value as string)}
            value={localVideoInputDeviceId || ''}
          >
            {videoInputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <DialogContentText>Video Input</DialogContentText>
          <DialogContentText>{localVideoTrack?.mediaStreamTrack.label}</DialogContentText>
        </>
      )}
      {localVideoTrack && <VideoTrack isLocal track={localVideoTrack} />}
    </div>
  );
}
