import Participant, { ParticipantProps } from '../Participant/Participant';
import ParticipantList from 'components/ParticipantList/ParticipantList';
import useParticipants from 'hooks/useParticipants/useParticipants';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import React from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import MainParticipant from '../MainParticipant/MainParticipant';
import useSessionContext from 'hooks/useSessionContext';

const sortByIdentity = (a: { identity: string }, b: { identity: string }) => {
  if (a.identity.toUpperCase() < b.identity.toUpperCase()) {
    return -1;
  }
  if (a.identity.toUpperCase() > b.identity.toUpperCase()) {
    return 1;
  }
  return 0;
};

export const GridVideoChatLayout = () => {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const { sessionData } = useSessionContext();

  const moderatorParitcipants = participants.filter(part => part.sid === sessionData?.moderator) as (
    | LocalParticipant
    | RemoteParticipant
  )[];
  const normalParticipants = participants.filter(part => part.sid !== sessionData?.moderator) as (
    | LocalParticipant
    | RemoteParticipant
  )[];
  if (localParticipant.sid === sessionData?.moderator) {
    moderatorParitcipants.push(localParticipant);
  } else {
    normalParticipants.push(localParticipant);
  }

  const ModeratorLetterInfo = (props: { participant: { identity: string } }) => (
    <div className="flex justify-center items-center space-x-3">
      <span className="text-lg font-semibold bg-yellow-500 rounded-full p-4 w-12 h-12 text-white flex justify-center items-center">
        {props.participant.identity[0].toUpperCase()}
      </span>
      <div className="flex flex-col">
        <span className="font-semibold">{props.participant.identity}</span>
        <span className="font-light">Moderator</span>
      </div>
    </div>
  );

  const ParticipantLetterInfo = (props: { participant: { identity: string } }) => (
    <div className="flex flex-col items-center space-y-1">
      <span className="uppercase rounded-full bg-red text-2xl font-semibold w-12 h-12 text-white flex justify-center items-center">
        {props.participant.identity[0]}
      </span>
      <span className="font-light">{props.participant.identity}</span>
    </div>
  );

  return (
    <div className="flex flex-col container mx-auto h-full">
      <div className="flex space-x-6 py-5 items-center">
        <div className="flex items-center space-x-6 pr-10">
          {moderatorParitcipants.sort(sortByIdentity).map(participant => (
            <ModeratorLetterInfo participant={participant} />
          ))}
        </div>
        {normalParticipants.sort(sortByIdentity).map(participant => (
          <ParticipantLetterInfo participant={participant} />
        ))}
      </div>
      <div className="flex-grow min max-h-full h-full grid grid-cols-4 grid-rows-4 gap-2 justify-center items-center">
        <div className="col-span-3 row-span-3 overflow-hidden">
          {moderatorParitcipants.length >= 1 ? <MainParticipant participant={moderatorParitcipants[0]} /> : null}
        </div>
        {/* <Participant isLocalParticipant participant={localParticipant} /> */}
        {normalParticipants.map(participant => (
          <Participant participant={participant} />
        ))}
      </div>
    </div>
  );
};
