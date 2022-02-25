import React from 'react';
import { RemoteAudioTrack, RemoteParticipant } from 'twilio-video';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useTracks from '../../hooks/useTracks/useTracks';
import AudioTrack from '../AudioTrack/AudioTrack';

function Participant({ participant }: { participant: RemoteParticipant }) {
  const tracks = useTracks(participant);
  const audioTrack = tracks.find(track => track.kind === 'audio') as RemoteAudioTrack | undefined;

  if (audioTrack?.kind === 'audio') return <AudioTrack track={audioTrack} />;

  return null;
}

export function ParticipantAudioTracks() {
  const participants = useParticipants();

  return participants.map(participant => <Participant key={participant.sid} participant={participant} />);
}
