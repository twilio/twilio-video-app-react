import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import AudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';

import { IVideoTrack } from '../../types';
import {
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  Track,
} from 'twilio-video';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocal: boolean;
  disableAudio?: boolean;
  videoPriority?: Track.Priority;
}

export default function Publication({ publication, isLocal, disableAudio, videoPriority }: PublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.name) {
    case 'screen':
      return <VideoTrack track={track as IVideoTrack} priority={videoPriority} />;
    case 'camera':
      return <VideoTrack track={track as IVideoTrack} isLocal={isLocal} priority={videoPriority} />;
    case 'microphone':
      return disableAudio ? null : <AudioTrack track={track as IAudioTrack} />;
    default:
      return null;
  }
}
