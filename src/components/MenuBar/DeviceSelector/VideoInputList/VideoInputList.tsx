import React from 'react';
import { FormControl, MenuItem, Typography, Select } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import { makeStyles } from '@material-ui/core/styles';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';
import { useVideoInputDevices } from '../deviceHooks/deviceHooks';
import VideoTrack from '../../../VideoTrack/VideoTrack';

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
    localVideoTrack?.stop();
    getLocalVideoTrack({ deviceId: { exact: newDeviceId } }).then(newTrack => {
      if (localVideoTrack) {
        const localTrackPublication = localParticipant?.unpublishTrack(localVideoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
      }

      localParticipant?.publishTrack(newTrack);
    });
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
          <Typography>{localVideoTrack?.mediaStreamTrack.label || 'No Local Video'}</Typography>
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
