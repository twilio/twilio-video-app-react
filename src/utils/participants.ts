import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { UserGroup } from 'types/UserGroup';
import { getUid } from './firebase/base';

const identityComperator = (a: { identity: string }, b: { identity: string }) => a.identity.localeCompare(b.identity);

export const categorizeParticipants = (
  participants: RemoteParticipant[],
  localParticipant?: LocalParticipant,
  moderators?: string[]
) => {
  let allParticipants: (LocalParticipant | RemoteParticipant)[] = [...participants];
  if (localParticipant) {
    allParticipants.push(localParticipant);
  }
  allParticipants = allParticipants.filter(part => {
    const name = nameFromIdentity(part.identity);
    return name !== UserGroup.StreamServer && name !== UserGroup.StreamServerTranslated;
  });
  allParticipants.sort(identityComperator);

  const translatorParticipant = allParticipants.find(part => nameFromIdentity(part.identity) === UserGroup.Translator);
  const speakerParticipants = allParticipants.filter(part => nameFromIdentity(part.identity) !== UserGroup.Translator);
  const moderatorParitcipants = speakerParticipants.filter(part => moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];
  const normalParticipants = speakerParticipants.filter(part => !moderators?.includes(part.sid)) as (
    | LocalParticipant
    | RemoteParticipant
  )[];

  return {
    moderatorParitcipants,
    normalParticipants,
    translatorParticipant,
    speakerParticipants,
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
