import React from 'react';
import { VideoTrack as IVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import { useVideoContext } from '../../hooks/context';

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name === 'camera') as IVideoTrack;

  return videoTrack ? <VideoTrack track={videoTrack} isLocal /> : null;
}
