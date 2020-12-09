import { PARTICIANT_TYPES } from '../participantTypes';

export default function isModerator(partyType: string) {
  return partyType === PARTICIANT_TYPES.REPORTER || partyType === PARTICIANT_TYPES.HEARING_OFFICER;
}
