import React from 'react';
import { useVideoInputDevices } from '../hooks/hooks';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';
import { FormControl, InputLabel, Select, MenuItem, DialogContentText, Typography } from '@material-ui/core';

import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../../../VideoTrack/VideoTrack';

import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  preview: {
    width: '150px',
    margin: '0.5em 0',
  },
});

export default function VideoInputList() {
  const classes = useStyles();
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
          <Typography variant="h6">Video Input:</Typography>
          <Select onChange={e => replaceTrack(e.target.value as string)} value={localVideoInputDeviceId || ''}>
            {videoInputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="h6">Video Input:</Typography>
          <Typography>{localVideoTrack?.mediaStreamTrack.label}</Typography>
        </>
      )}
      {localVideoTrack && (
        <div className={classes.preview}>
          <VideoTrack isLocal track={localVideoTrack} />
        </div>
      )}
    </div>
  );
}
