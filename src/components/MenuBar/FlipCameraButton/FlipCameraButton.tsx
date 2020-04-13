import React, { useCallback, useRef, useEffect, useState } from 'react';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { IconButton } from '@material-ui/core';

export default function FlipCameraButton() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
  } = useVideoContext();
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);
  const videoTrack = localTracks.find(track => track.name === 'camera');
  const facingMode = videoTrack?.mediaStreamTrack.getSettings().facingMode;

  useEffect(() => {
    if (facingMode && supportsFacingMode === null) {
      setSupportsFacingMode(Boolean(facingMode));
    }
  }, [facingMode]);

  const toggleFacingMode = useCallback(() => {
    const localTrackPublication = localParticipant?.unpublishTrack(videoTrack!);
    // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
    localParticipant?.emit('trackUnpublished', localTrackPublication);
    videoTrack!.stop();
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    getLocalVideoTrack(newFacingMode).then(newVideoTrack => {
      localParticipant?.publishTrack(newVideoTrack, { priority: 'low' });
    });
  }, [facingMode, getLocalVideoTrack, localParticipant, videoTrack]);

  return supportsFacingMode ? (
    <IconButton onClick={toggleFacingMode} disabled={!videoTrack}>
      <FlipCameraIosIcon />
    </IconButton>
  ) : null;
}
