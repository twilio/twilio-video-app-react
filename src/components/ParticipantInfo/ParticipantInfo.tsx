import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';

const Container = styled('div')({
  position: 'relative',
});

const InfoContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.3em',
  width: '100%',
});

const Identity = styled('h4')({
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '0.1em 0.3em',
  margin: 0,
});

interface ParticipantInfoProps {
  participant: LocalParticipant | RemoteParticipant;
  children: React.ReactNode;
}

export default function ParticipantInfo({
  participant,
  children,
}: ParticipantInfoProps) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);

  return (
    <Container>
      <InfoContainer>
        <Identity>{participant.identity}</Identity>
        <NetworkQualityLevel qualityLevel={networkQualityLevel} />
      </InfoContainer>
      {children}
    </Container>
  );
}
