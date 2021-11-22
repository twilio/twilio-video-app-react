import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { ISession, UserGroup } from 'types';
import { getUid } from './firebase/base';

const identityComperator = (a: { identity: string }, b: { identity: string }) => a.identity.localeCompare(b.identity);

export const sortedParticipantsByCategorie = (
  moderators: string[],
  localParticipant: LocalParticipant,
  participants: RemoteParticipant[]
) => {
  let allParticipants: (LocalParticipant | RemoteParticipant)[] = [...participants];
  allParticipants.push(localParticipant);
  allParticipants = allParticipants.filter(part => nameFromIdentity(part.identity) !== UserGroup.StreamServer);
  allParticipants.sort(identityComperator);

  const moderatorParitcipants = allParticipants.filter(part => moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];
  const normalParticipants = allParticipants.filter(part => !moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];

  return {
    moderatorParitcipants,
    normalParticipants,
  };
};

export const IDENTITY_SPLITTER = '#*#';

export const nameFromIdentity = (identity: string) => {
  const split = identity.split(IDENTITY_SPLITTER, 2);
  if (split.length !== 2) {
    throw new Error('Identity not correctly formated: ' + identity);
  }
  return split[1];
};

export const uidFromIdentity = (identity: string) => {
  const split = identity.split(IDENTITY_SPLITTER, 2);
  if (split.length !== 2) {
    throw new Error('Identity not correctly formated: ' + identity);
  }
  return split[0];
};

export const generateIdentity = (name: string) =>
  getUid().then(uid => {
    return uid + IDENTITY_SPLITTER + name;
  });
