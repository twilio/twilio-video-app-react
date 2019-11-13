import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import MicOff from '@material-ui/icons/MicOff';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import usePublicationIsTrackEnabled from '../../hooks/usePublicationIsTrackEnabled/usePublicationIsTrackEnabled';

const Container = styled(({ isSelected, ...otherProps }: { isSelected: boolean; onClick: () => void }) => (
  <div {...otherProps}></div>
))({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  minHeight: '5em',
  border: ({ isSelected }) => (isSelected ? '1px solid white' : '1px solid transparent'),
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
  onClick: () => void;
  isSelected: boolean;
}

export default function ParticipantInfo({ participant, children, onClick, isSelected }: ParticipantInfoProps) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const publications = usePublications(participant);
  const isAudioEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'microphone'));
  const isVideoEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'camera'));
  const isScreenShareEnabled = usePublicationIsTrackEnabled(publications.find(p => p.trackName === 'screen'));

  return (
    <Container onClick={onClick} isSelected={isSelected}>
      <InfoContainer hideVideo={!isVideoEnabled}>
        <InfoRow>
          <Identity>{participant.identity}</Identity>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </InfoRow>
        <div>
          {!isAudioEnabled && <MicOff />}
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
        </div>
      </InfoContainer>
      {children}
    </Container>
  );
}
