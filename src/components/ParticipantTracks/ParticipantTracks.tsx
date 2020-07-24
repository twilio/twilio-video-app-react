import React from 'react';
import { Participant, Track, AudioTrack } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useParticipantTracks from '../../hooks/useParticipantTracks/useParticipantTracks';
import VideoTrack from '../VideoTrack/VideoTrack';
import { IVideoTrack } from '../../types';

interface ParticipantTracksProps {
  participant: Participant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({
  participant,
  disableAudio,
  enableScreenShare,
  videoPriority,
}: ParticipantTracksProps) {
  const { room } = useVideoContext();
  const tracks = useParticipantTracks(participant);
  const isLocal = participant === room.localParticipant;

  let filteredTracks;

  if (enableScreenShare && tracks.some(track => track.name.includes('screen'))) {
    filteredTracks = tracks.filter(track => !track.name.includes('camera'));
  } else {
    filteredTracks = tracks.filter(track => !track.name.includes('screen'));
  }

  const audioTrack = disableAudio ? undefined : (filteredTracks.find(track => track.kind === 'audio') as AudioTrack);
  const videoTrack = filteredTracks.find(track => track.kind === 'video') as IVideoTrack;

  return <VideoTrack audioTrack={audioTrack} videoTrack={videoTrack} isLocal={isLocal} priority={videoPriority} />;
}
