import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { ISession } from 'types';

const identityComperator = (a: { identity: string }, b: { identity: string }) => a.identity.localeCompare(b.identity);

export const sortedParticipantsByCategorie = (
  sessionData: ISession,
  localParticipant: LocalParticipant,
  participants: RemoteParticipant[]
) => {
  const allParticipants: (LocalParticipant | RemoteParticipant)[] = [...participants];
  allParticipants.push(localParticipant);
  allParticipants.sort(identityComperator);

  const moderatorParitcipants = allParticipants.filter(part => sessionData?.moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];
  const normalParticipants = allParticipants.filter(part => !sessionData?.moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];

  return {
    moderatorParitcipants,
    normalParticipants,
  };
};
