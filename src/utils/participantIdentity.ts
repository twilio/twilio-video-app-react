export class ParticipantIdentity {
  partyName: string = '';
  partyType: string = '';
  personId?: string = undefined;
  userId?: string = undefined;
  isRegisteredUser: boolean = false;

  participantIdentityParts: string[] = [];

  constructor(participantIdentityAsString: string) {
    if (participantIdentityAsString == null) throw new Error('participantIdentityAsString is null');
    if (participantIdentityAsString === '') throw new Error('participantIdentityAsString is empty');

    this.participantIdentityParts = participantIdentityAsString.split('@');
    this.partyName = this.participantIdentityParts[0];
    this.partyType = this.participantIdentityParts[1];

    if (this.participantIdentityParts.length > 1) this.personId = this.participantIdentityParts[2];

    if (this.participantIdentityParts.length > 2) {
      this.userId = this.participantIdentityParts[2];
      this.isRegisteredUser = true;
    }
  }

  static Parse(inputString: string) {
    return new ParticipantIdentity(inputString);
  }
}
