import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import usePublicationIsTrackEnabled from '../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';
import MicOff from '@material-ui/icons/MicOff';
import ScreenShare from '@material-ui/icons/ScreenShare';

const Container = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const InfoContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  padding: '0.4em',
  width: '100%',
  background: ({ hideVideo }: { hideVideo?: boolean }) => (hideVideo ? 'black' : 'transparent'),
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

export default function ParticipantInfo({ participant, children }: ParticipantInfoProps) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const publications = usePublications(participant);
  const isAudioEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'microphone'));
  const isVideoEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'camera'));
  const isScreenShareEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'screen'));

  return (
    <Container>
      <InfoContainer hideVideo={!isVideoEnabled}>
        <InfoRow>
          <Identity>{participant.identity}</Identity>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </InfoRow>
        <div>
          {!isAudioEnabled && <MicOff />}
          {isScreenShareEnabled && <ScreenShare />}
        </div>
      </InfoContainer>
      {children}
    </Container>
  );
}
