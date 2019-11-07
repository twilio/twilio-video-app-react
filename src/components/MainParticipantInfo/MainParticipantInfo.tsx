import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import usePublications from '../../hooks/usePublications/usePublications';
import usePublicationIsTrackEnabled from '../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';

const Container = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const InfoContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  height: '100%',
  padding: '0.4em',
  width: '100%',
  background: ({ hideVideo }: { hideVideo?: boolean }) => (hideVideo ? 'black' : 'transparent'),
});

const Identity = styled('h4')({
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '0.1em 0.3em',
  margin: '1em',
  fontSize: '1.2em',
  display: 'inline-block',
});

interface ParticipantInfoProps {
  participant: LocalParticipant | RemoteParticipant;
  children: React.ReactNode;
}

export default function ParticipantInfo({ participant, children }: ParticipantInfoProps) {
  const publications = usePublications(participant);
  const isVideoEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'camera'));

  return (
    <Container>
      <InfoContainer hideVideo={!isVideoEnabled}>
        <Identity>{participant.identity}</Identity>
      </InfoContainer>
      {children}
    </Container>
  );
}
