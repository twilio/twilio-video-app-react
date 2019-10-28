import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import {
  Participant,
  VideoTrack as IVideoTrack,
  LocalTrackPublication,
  RemoteTrackPublication,
} from 'twilio-video';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
}

export default function Publication({ publication }: PublicationProps) {
  const track = useTrack(publication);
  if (track === null) return null;
  return track.name === 'camera' ? (
    <VideoTrack track={track as IVideoTrack} />
  ) : null;
}
