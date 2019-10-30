import React from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import Publication from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import { useVideoContext } from '../../hooks/context';

interface ParticipantTracksProps {
  participant: LocalParticipant | RemoteParticipant;
}

export default function ParticipantTracks({
  participant,
}: ParticipantTracksProps) {
  const { room } = useVideoContext();
  const publications = usePublications(participant);
  const isLocal = participant === room.localParticipant;

  return (
    <>
      {publications.map(publication => (
        <Publication
          key={publication.trackSid}
          publication={publication}
          participant={participant}
          isLocal={isLocal}
        />
      ))}
    </>
  );
}
