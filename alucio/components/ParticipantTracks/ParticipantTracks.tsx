import React from 'react';
import { Participant, Track } from 'twilio-video';
import { IVideoTrack } from 'src/packages/video/src/types';
import { Iffy } from '@alucio/lux-ui'
import Publication from '../../components/Publication/Publication';
import ParticipantPlaceholder from '../ParticipantInfo/ParticipantPlaceholder/ParticipantPlaceholder'
import usePublications from '../../../src/hooks/usePublications/usePublications';
import useVideoContext from '../../../src/hooks/useVideoContext/useVideoContext';
import useTrack from '../../../src/hooks/useTrack/useTrack'

interface ParticipantTracksProps {
  participant: Participant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

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

  if (enableScreenShare && publications.some(p => p.trackName.includes('screen'))) {
    filteredPublications = publications.filter(p => !p.trackName.includes('camera'));
  } else {
    filteredPublications = publications.filter(p => !p.trackName.includes('screen'));
  }

  const videoPublication = filteredPublications.find(p => p.trackName.includes('camera'))
  const videoTrack = useTrack(videoPublication) as IVideoTrack
  const showPlaceholder = !(
    videoTrack?.isEnabled
    // videoTrack?.isStarted is not apart of the React lifecycle so renders dependant on it are flaky
    // && videoTrack?.isStarted
  )

  return (
    <>
      {
        filteredPublications.map((publication, idx) => (
          <Publication
            key={`${publication.kind}-${idx}`}
            publication={publication}
            participant={participant}
            isLocal={isLocal}
            disableAudio={disableAudio}
            videoPriority={videoPriority}
          />
        ))
      }
      {/* Assume all other Publications contain no video track in a ready state */}
      <Iffy is={showPlaceholder}>
        <ParticipantPlaceholder />
      </Iffy>
    </>
  );
}
