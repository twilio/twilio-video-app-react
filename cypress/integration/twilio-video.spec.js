/// <reference types="Cypress" />

// Creates a random string like 'ft68eyjn8i'
const getRoomName = () =>
  Math.random()
    .toString(36)
    .slice(2); 

context('A video app user', () => {
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
      cy.getParticipant('test1').shouldBeSameVideoAs('[data-cy-main-participant]')
    });

    it('should be able to hear the other participant', () => {
      cy.getParticipant('test1').shouldBeMakingSound()
    })
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
      cy.getParticipant('test1').shouldBeSameVideoAs('[data-cy-main-participant]')
    });

    it('should be able to hear the other participant', () => {
      cy.getParticipant('test1').shouldBeMakingSound()
    })
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
      cy.getParticipant('test1').shouldBeColor('red')
      cy.getParticipant('test2').shouldBeColor('blue')
      cy.getParticipant('test3').shouldBeColor('green')
    });

    it('should be able to hear the other participants', () => {
      cy.getParticipant('test1').shouldBeMakingSound()
      cy.getParticipant('test2').shouldBeMakingSound()
      cy.getParticipant('test3').shouldBeMakingSound()
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
      cy.getParticipant('test1').shouldBeColor('red')
      cy.getParticipant('test2').shouldBeColor('blue')
      cy.getParticipant('test3').shouldBeColor('green')
    });

    it('should be able to hear the other participants', () => {
      cy.getParticipant('test1').shouldBeMakingSound()
      cy.getParticipant('test2').shouldBeMakingSound()
      cy.getParticipant('test3').shouldBeMakingSound()
    });
  });
});
