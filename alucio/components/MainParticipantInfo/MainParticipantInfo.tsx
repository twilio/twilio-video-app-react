import React from 'react';
import { LocalVideoTrack, Participant, RemoteVideoTrack } from 'twilio-video';

import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import useIsTrackSwitchedOff from '../../../src/hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../../src/hooks/usePublications/usePublications';
import useTrack from '../../../src/hooks/useTrack/useTrack';

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const publications = usePublications(participant);
  const videoPublication = publications.find(p => p.trackName.includes('camera'));
  const screenSharePublication = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  return (
    <div
      data-cy-main-participant
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gridArea: 'participantList',
      }}
    >
      <div style={{
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        padding: '0.4em',
        width: '100%',
      }} />
      {isVideoSwitchedOff && <BandwidthWarning />}
      {children}
    </div>
  );
}
