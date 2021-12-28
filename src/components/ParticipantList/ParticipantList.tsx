import React from 'react';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
// import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
// import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useSessionContext from 'hooks/useSessionContext';
import { ChooseableParticipant, ChooseableParticipantProps } from 'components/ChooseableParticipant';
import { nameFromIdentity, categorizeParticipants } from 'utils/participants';

const SmallParticipant = (props: ChooseableParticipantProps) => (
  <div className="w-40 relative flex flex-col">
    <ChooseableParticipant {...props} noName />
    <span className="w-full text-center text-gray-700 mt-1 break-words">
      {nameFromIdentity(props.participant.identity)}
    </span>
  </div>
);

export default function ParticipantList() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  // const [selectedParticipant] = useSelectedParticipant();
  // const screenShareParticipant = useScreenShareParticipant();
  const { moderators } = useSessionContext();

  const { moderatorParitcipants, normalParticipants } = categorizeParticipants(
    participants,
    localParticipant,
    moderators
  );

  return (
    <div className="flex overflow-x-auto pr-5 pt-5 gap-x-5 bg-grayish pl-2">
      {moderatorParitcipants.map((participant, i) => {
        return (
          <SmallParticipant
            key={participant.sid}
            participant={participant}
            // isSelected={participant === selectedParticipant}
            isModerator
            isLocalParticipant={localParticipant.sid === participant.sid}
          />
        );
      })}
      {normalParticipants.map(participant => {
        return (
          <SmallParticipant
            key={participant.sid}
            participant={participant}
            // isSelected={participant === selectedParticipant}
            isLocalParticipant={localParticipant.sid === participant.sid}
          />
        );
      })}
    </div>
  );
}
