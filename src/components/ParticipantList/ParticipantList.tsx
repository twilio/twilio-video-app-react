import React from 'react';
import { ParticipantProps } from '../Participant/Participant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
// import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useSessionContext from 'hooks/useSessionContext';
import { ChooseableParticipant } from 'components/ChooseableParticipant';
import { sortedParticipantsByCategorie } from 'utils/participants';
import { ISession } from 'types';
import useGameContext from 'hooks/useGameContext';

export default function ParticipantList() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const [selectedParticipant] = useSelectedParticipant();
  // const screenShareParticipant = useScreenShareParticipant();
  const { sessionData } = useSessionContext();

  const { moderatorParitcipants, normalParticipants } = sortedParticipantsByCategorie(
    sessionData as ISession,
    localParticipant,
    participants
  );

  const SmallParticipant = (props: ParticipantProps) => (
    <div className="w-40 relative flex flex-col">
      <ChooseableParticipant {...props} noName />
      <span className="w-full text-center text-gray-700 mt-1">{props.participant.identity}</span>
    </div>
  );

  return (
    <div className="flex justify-center overflow-x-auto gap-x-5 bg-grayish my-">
      {moderatorParitcipants.map(participant => {
        return (
          <SmallParticipant
            key={participant.sid}
            participant={participant}
            isSelected={participant === selectedParticipant}
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
            isSelected={participant === selectedParticipant}
            isLocalParticipant={localParticipant.sid === participant.sid}
          />
        );
      })}
    </div>
  );
}
