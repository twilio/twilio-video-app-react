import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import usePublicationIsTrackEnabled from '../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';
import MicOff from '@material-ui/icons/MicOff';

const Container = styled('div')({
  position: 'relative',
});

const InfoContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  padding: '0.3em',
  width: '100%',
});

const Identity = styled('h4')({
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '0.1em 0.3em',
  margin: 0,
});

const InfoRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
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
  const publications = usePublications(participant);
  const audioIsEnabled = usePublicationIsTrackEnabled(
    publications.find(p => p.trackName === 'microphone')
  );

  return (
    <Container>
      <InfoContainer>
        <InfoRow>
          <Identity>{participant.identity}</Identity>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </InfoRow>
        {!audioIsEnabled && <MicOff />}
      </InfoContainer>
      {children}
    </Container>
  );
}
