import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import VideocamOff from '@material-ui/icons/VideocamOff';

import usePublications from '../../hooks/usePublications/usePublications';

const Container = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

export const InfoContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  height: '100%',
  padding: '0.4em',
  width: '100%',
});

const Identity = styled('h4')({
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '0.1em 0.3em',
  margin: '1em',
  fontSize: '1.2em',
  display: 'inline-flex',
  '& svg': {
    marginLeft: '0.3em',
  },
});

interface MainParticipantInfoProps {
  participant: LocalParticipant | RemoteParticipant;
  children: React.ReactNode;
}

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const publications = usePublications(participant);
  const isVideoEnabled = publications.some(p => p.trackName === 'camera');

  return (
    <Container data-cy-main-participant>
      <InfoContainer>
        <Identity>
          {participant.identity}
          {!isVideoEnabled && <VideocamOff />}
        </Identity>
      </InfoContainer>
      {children}
    </Container>
  );
}
