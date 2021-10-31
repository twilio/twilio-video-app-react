import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { ISession } from 'types';

const identityComperator = (a: { identity: string }, b: { identity: string }) => a.identity.localeCompare(b.identity);

export const sortedParticipantsByCategorie = (
  moderators: string[],
  localParticipant: LocalParticipant,
  participants: RemoteParticipant[]
) => {
  const allParticipants: (LocalParticipant | RemoteParticipant)[] = [...participants];
  allParticipants.push(localParticipant);
  allParticipants.sort(identityComperator);

  const moderatorParitcipants = allParticipants.filter(part => moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];
  const normalParticipants = allParticipants.filter(part => !moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];

  console.log('sorted', moderatorParitcipants, normalParticipants);

  return {
    moderatorParitcipants,
    normalParticipants,
  };
};
