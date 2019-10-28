import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import AudioTrack from '../AudioTrack/AudioTrack';
import {
  Participant,
  VideoTrack as IVideoTrack,
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  RemoteTrackPublication,
} from 'twilio-video';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocal?: boolean;
}

export default function Publication({
  publication,
  isLocal,
}: PublicationProps) {
  const track = useTrack(publication);

  if (track === null) return null;

  switch (track.name) {
    case 'camera':
      return <VideoTrack track={track as IVideoTrack} isLocal={isLocal} />;
    case 'microphone':
      return <AudioTrack track={track as IAudioTrack} />;
    default:
      return null;
  }
}
