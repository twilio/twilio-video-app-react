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
import { Transition } from '@headlessui/react';

const Placeholder = () => <div className="h-full w-full bg-black rounded-xl absolute top-0" />;

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocalParticipant?: boolean;
  videoOnly?: boolean;
  videoPriority?: Track.Priority | null;
  isActivePlayer?: boolean;
}

export default function Publication({ publication, isLocalParticipant, videoOnly, videoPriority }: PublicationProps) {
  const track = useTrack(publication);

  if (!track) return <Placeholder />;

  switch (track.kind) {
    case 'video':
      return (
        <Transition
          appear
          show
          className="transition-all duration-500 absolute w-full h-full"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <VideoTrack
            track={track as IVideoTrack}
            priority={videoPriority}
            isLocal={!track.name.includes('screen') && isLocalParticipant}
          />
        </Transition>
      );
    case 'audio':
      return videoOnly ? null : <AudioTrack track={track as IAudioTrack} />;
    default:
      return <Placeholder />;
  }
}
