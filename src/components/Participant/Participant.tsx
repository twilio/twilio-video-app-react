import React from 'react';
import Publication from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
}

export default function Participant({ participant }: ParticipantProps) {
  const publications = usePublications(participant);
  return (
    <>
      {publications.map(publication => (
        <Publication
          key={publication.trackSid}
          publication={publication}
          participant={participant}
        />
      ))}
    </>
  );
}
