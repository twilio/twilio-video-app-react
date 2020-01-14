import React from 'react';
import { styled } from '@material-ui/core/styles';
import { LocalParticipant, RemoteParticipant, RemoteVideoTrack, LocalVideoTrack } from 'twilio-video';

import BandwidthWarning from './BandwidthWarning/BandwidthWarning';
import MicOff from '@material-ui/icons/MicOff';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';

interface ContainerProps {
  isSelected: boolean;
  isSwitchedOff: boolean;
  onClick: () => void;
}
const Container = styled(({ isSelected, isSwitchedOff, ...otherProps }: ContainerProps) => <div {...otherProps}></div>)(
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: '5em',
    border: ({ isSelected }) => (isSelected ? '1px solid white' : '1px solid transparent'),
    overflow: 'hidden',
    '& video': {
      filter: ({ isSwitchedOff }) => (isSwitchedOff ? 'blur(4px) grayscale(1) brightness(0.5)' : 'none'),
    },
  }
);

export const InfoContainer = styled(({ hideVideo, ...otherProps }: { hideVideo?: boolean }) => <div {...otherProps} />)(
  {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '0.4em',
    width: '100%',
    background: ({ hideVideo }) => (hideVideo ? 'black' : 'transparent'),
  }
);

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

export default function ParticipantInfo({ participant, onClick, isSelected, children }: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const videoPublication = publications.find(p => p.trackName === 'camera');

  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isAudioEnabled = publications.some(p => p.kind === 'audio');
  const isVideoEnabled = publications.some(p => p.trackName === 'camera');
  const isScreenShareEnabled = publications.find(p => p.trackName === 'screen');

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  return (
    <Container
      onClick={onClick}
      isSelected={isSelected}
      isSwitchedOff={isVideoSwitchedOff}
      data-cy-participant={participant.identity}
    >
      <InfoContainer hideVideo={!isVideoEnabled}>
        <InfoRow>
          <Identity>{participant.identity}</Identity>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </InfoRow>
        <div>
          {!isAudioEnabled && <MicOff data-cy-audio-mute-icon />}
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
        </div>
      </InfoContainer>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </Container>
  );
}
