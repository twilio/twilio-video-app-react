import React from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import { useVideoContext } from '../../main';
import ParticipantMeetingPlaceholder from '../ParticipantInfo/ParticipantPlaceholder/ParticipantMeetingPlaceholder';

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  console.info('test', videoTrack);

  return videoTrack ? <VideoTrack track={videoTrack} isLocal /> : <ParticipantMeetingPlaceholder />;
}
