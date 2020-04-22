import React from 'react';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';
import { useMediaStreamTrack, useAudioInputDevices } from '../hooks/hooks';
import { LocalAudioTrack } from 'twilio-video';
import AudioLevelIndicator from '../../../AudioLevelIndicator/AudioLevelIndicator';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

export function AudioInputDevicePreview({ audioInputDevice }: { audioInputDevice: MediaDeviceInfo }) {
  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
  } = useVideoContext();
  const localAudioTrack = localTracks.find(track => track.kind === 'audio');
  const mediaStreamTrack = useMediaStreamTrack(audioInputDevice);

  const isSelected = mediaStreamTrack === localAudioTrack?.mediaStreamTrack;

  const track = ({
    isEnabled: mediaStreamTrack?.enabled,
    mediaStreamTrack,
    on: () => {},
    off: () => {},
  } as any) as LocalAudioTrack;

  function handleNew() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      const localTrackPublication = localParticipant?.unpublishTrack(localAudioTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant?.emit('trackUnpublished', localTrackPublication);
    }
    if (mediaStreamTrack) {
      mediaStreamTrack.stop();

      getLocalAudioTrack(audioInputDevice.deviceId).then(newTrack => {
        localParticipant?.publishTrack(newTrack);
      });
    }
  }

  return (
    <ListItem onClick={() => !isSelected && handleNew()} button selected={isSelected}>
      <ListItemText>{audioInputDevice.label}</ListItemText>
      {mediaStreamTrack && (
        <ListItemSecondaryAction>
          <AudioLevelIndicator audioTrack={track} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export default function AudioInputList() {
  const audioInputDevices = useAudioInputDevices();

  return (
    <List>
      {audioInputDevices.map(device => (
        <AudioInputDevicePreview audioInputDevice={device} key={device.deviceId} />
      ))}
    </List>
  );
}
