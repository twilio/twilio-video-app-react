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

export default function ParticipantList() {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  // const screenShareParticipant = useScreenShareParticipant();
  const { sessionData } = useSessionContext();

  const { moderatorParitcipants, normalParticipants } = sortedParticipantsByCategorie(
    sessionData as ISession,
    localParticipant,
    participants
  );

  const SmallParticipant = (props: ParticipantProps) => (
    <div className="w-40 relative">
      <ChooseableParticipant {...props} />
    </div>
  );

  return (
    <div className="flex justify-center items-center overflow-x-auto gap-x-5 bg-grayish my-">
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
