import { TRACK_TYPE } from '../../utils/displayStrings';
import { LocalDataTrack, LocalDataTrackOptions, LocalParticipant } from 'twilio-video';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import { useState } from 'react';
import isModerator from 'utils/rbac/roleChecker';
import { ParticipantInformation } from 'state';

export default function usePublishDataTrack(participantInfo: ParticipantInformation | null) {
  const {
    room: { localParticipant },
  } = useVideoContext();

  const [havePublishedLocalModeratorDataTrack, setHavePublishedLocalModeratorDataTrack] = useState(false);

  if (havePublishedLocalModeratorDataTrack || participantInfo === null || localParticipant === undefined) {
    return;
  }

  if (isModerator(participantInfo.partyType)) {
    publishDataTrack(localParticipant);
  }
  setHavePublishedLocalModeratorDataTrack(true);
}

async function publishDataTrack(localParticipant: LocalParticipant) {
  console.log('adding data track for this participant');

  let localDataTrackOptions = {} as LocalDataTrackOptions;
  //localDataTrackOptions.maxPacketLifeTime = 1000;
  localDataTrackOptions.maxRetransmits = 3;
  localDataTrackOptions.ordered = true;

  var moderatorTrack = new LocalDataTrack(localDataTrackOptions);
  try {
    const localTrackPublication = await localParticipant.publishTrack(moderatorTrack);
    console.log(
      `local track published ${localTrackPublication.track.id}. track name:  ${localTrackPublication.track.id}. track kind:  ${localTrackPublication.track.kind}. local participant identity ${localParticipant.identity}`
    );
  } catch (error) {
    console.log(
      `error while publishing local channel for local participant with identity: ${localParticipant.identity}`
    );
  }
}
