/// <reference types="Cypress" />

// If you are on MacOS and have many popups about Chromium when these tests run, please see: https://stackoverflow.com/questions/54545193/puppeteer-chromium-on-mac-chronically-prompting-accept-incoming-network-connect

// Creates a random string like 'ft68eyjn8i'
const getRoomName = () =>
  Math.random()
    .toString(36)
    .slice(2);

context('A video app user', () => {
  describe('before entering a room', () => {
    it('should see their audio level indicator moving in the media device panel', () => {
      cy.visit('/');
      cy.get('[data-cy-device-select]').click();
      cy.get('clipPath rect')
        .invoke('attr', 'y')
        .should('be', 21);
      cy.get('clipPath rect')
        .invoke('attr', 'y')
        .should('be.lessThan', 21);
    });
  });

  describe('when entering an empty room that one participant will join', () => {
    const ROOM_NAME = getRoomName();

    before(() => {
      cy.joinRoom('testuser', ROOM_NAME);
      cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME });
    });

    after(() => {
      cy.leaveRoom();
    });

    it('should be inside the correct room', () => {
      cy.get('header').should('contain', ROOM_NAME);
      cy.getParticipant('testuser').should('contain', 'testuser');
    });

    it('should be able to see the other participant', () => {
      cy.get('[data-cy-main-participant]').should('contain', 'test1');
      cy.getParticipant('test1')
        .should('contain', 'test1')
        .shouldBeSameVideoAs('[data-cy-main-participant]');
    });

    it('should be able to hear the other participant', () => {
      cy.getParticipant('test1').shouldBeMakingSound();
    });

    it('should see the participants audio level indicator moving', () => {
      cy.getParticipant('test1')
        .get('clipPath rect')
        .invoke('attr', 'y')
        .should('be', 21);
      cy.get('clipPath rect')
        .invoke('attr', 'y')
        .should('be.lessThan', 21);
    });

    it('should see other participants disconnect when they close their browser', () => {
      cy.task('participantCloseBrowser', 'test1');
      cy.getParticipant('test1').should('not.exist');
      cy.get('[data-cy-main-participant]').should('contain', 'testuser');
    });
  });

  describe('when entering a room with one participant', () => {
    const ROOM_NAME = getRoomName();

    before(() => {
      cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME });
      cy.joinRoom('testuser', ROOM_NAME);
    });

    after(() => {
      cy.leaveRoom();
    });

    it('should be able to see the other participant', () => {
      cy.get('[data-cy-main-participant]').should('contain', 'test1');
      cy.getParticipant('test1')
        .should('contain', 'test1')
        .shouldBeSameVideoAs('[data-cy-main-participant]');
    });

    it('should be able to hear the other participant', () => {
      cy.getParticipant('test1').shouldBeMakingSound();
    });
  });

  describe('when entering an empty room that three participants will join', () => {
    const ROOM_NAME = getRoomName();

    before(() => {
      cy.joinRoom('testuser', ROOM_NAME);
      cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME, color: 'red' });
      cy.task('addParticipant', { name: 'test2', roomName: ROOM_NAME, color: 'blue' });
      cy.task('addParticipant', { name: 'test3', roomName: ROOM_NAME, color: 'green' });
    });

    after(() => {
      cy.leaveRoom();
    });

    it('should be able to see the other participants', () => {
      cy.getParticipant('test1')
        .should('contain', 'test1')
        .shouldBeColor('red');
      cy.getParticipant('test2')
        .should('contain', 'test2')
        .shouldBeColor('blue');
      cy.getParticipant('test3')
        .should('contain', 'test3')
        .shouldBeColor('green');
    });

    it('should be able to hear the other participants', () => {
      cy.getParticipant('test1').shouldBeMakingSound();
      cy.getParticipant('test2').shouldBeMakingSound();
      cy.getParticipant('test3').shouldBeMakingSound();
    });
  });

  describe('when entering a room with three participants', () => {
    const ROOM_NAME = getRoomName();

    before(() => {
      cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME, color: 'red' });
      cy.task('addParticipant', { name: 'test2', roomName: ROOM_NAME, color: 'blue' });
      cy.task('addParticipant', { name: 'test3', roomName: ROOM_NAME, color: 'green' });
      cy.joinRoom('testuser', ROOM_NAME);
    });

    after(() => {
      cy.leaveRoom();
    });

    it('should be able to see the other participants', () => {
      cy.getParticipant('test1')
        .should('contain', 'test1')
        .shouldBeColor('red');
      cy.getParticipant('test2')
        .should('contain', 'test2')
        .shouldBeColor('blue');
      cy.getParticipant('test3')
        .should('contain', 'test3')
        .shouldBeColor('green');
    });

    it('should be able to hear the other participants', () => {
      cy.getParticipant('test1').shouldBeMakingSound();
      cy.getParticipant('test2').shouldBeMakingSound();
      cy.getParticipant('test3').shouldBeMakingSound();
    });

    it('should see participant "test1" when they are the dominant speaker', () => {
      cy.task('toggleParticipantAudio', 'test2');
      cy.task('toggleParticipantAudio', 'test3');
      cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test1').shouldBeSameVideoAs('[data-cy-main-participant]');
    });

    it('should see participant "test2" when they are the dominant speaker', () => {
      cy.task('toggleParticipantAudio', 'test1');
      cy.task('toggleParticipantAudio', 'test2');
      cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test2').shouldBeSameVideoAs('[data-cy-main-participant]');
    });

    it('should see participant "test3" when they are the dominant speaker', () => {
      cy.task('toggleParticipantAudio', 'test2');
      cy.task('toggleParticipantAudio', 'test3');
      cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test3').shouldBeSameVideoAs('[data-cy-main-participant]');
    });

    it('should see participant "test3" when there is no dominant speaker', () => {
      cy.task('toggleParticipantAudio', 'test3');
      cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
      cy.getParticipant('test3').shouldBeSameVideoAs('[data-cy-main-participant]');
    });
  });
});
