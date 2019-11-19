import React from 'react';
import { LocalParticipant, RemoteParticipant, Track } from 'twilio-video';
import Publication from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import { useVideoContext } from '../../hooks/context';

interface ParticipantTracksProps {
  participant: LocalParticipant | RemoteParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority;
}

export default function ParticipantTracks({
  participant,
  disableAudio,
  enableScreenShare,
  videoPriority,
}: ParticipantTracksProps) {
  const { room } = useVideoContext();
  const publications = usePublications(participant);
  const isLocal = participant === room.localParticipant;

  let filteredPublications;

  if (enableScreenShare && publications.some(p => p.trackName === 'screen')) {
    filteredPublications = publications.filter(p => p.trackName !== 'camera');
  } else {
    filteredPublications = publications.filter(p => p.trackName !== 'screen');
  }

  return (
    <>
      {filteredPublications.map(publication => (
        <Publication
          key={publication.trackSid}
          publication={publication}
          participant={participant}
          isLocal={isLocal}
          disableAudio={disableAudio}
          videoPriority={videoPriority}
        />
      ))}
    </>
  );
}
