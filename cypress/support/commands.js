import detectSound from './detectSound';

Cypress.Commands.add('joinRoom', (username, roomname) => {
  cy.visit('/');
  cy.get('#menu-name').type(username);
  cy.get('#menu-room').type(roomname);
  cy.get('[type="submit"]').click();
  cy.get('[data-cy-main-participant]');
});

Cypress.Commands.add('leaveRoom', () => {
  cy.wait(500);
  cy.get('body').click(); // Makes controls reappear
  cy.get('[title="End Call"]').click();
  cy.task('removeAllParticipants');
  cy.get('#menu-room');
});

Cypress.Commands.add('shouldBeColor', { prevSubject: 'element' }, (subject, color) => {
  cy.wrap(subject)
    .find('video')
    .then($video => {
      cy.readFile(`cypress/fixtures/${color}.png`, 'base64').should('be.sameVideoFile', $video);
    });
});

Cypress.Commands.add('shouldBeSameVideoAs', { prevSubject: 'element' }, (subject, participant) => {
  cy.wrap(subject)
    .find('video')
    .then($video =>
      cy
        .get(participant)
        .find('video')
        .should('be.sameVideoTrack', $video)
    );
});

Cypress.Commands.add('getParticipant', name => cy.get(`[data-cy-participant="${name}"]`));

Cypress.Commands.add('shouldBeMakingSound', { prevSubject: 'element' }, subject => {
  const resolveValue = $el =>
    detectSound($el[0]).then(value => {
      return cy.verifyUpcomingAssertions(
        value,
        {},
        {
          onRetry: () => resolveValue($el),
        }
      );
    });

  cy.wrap(subject)
    .find('audio')
    .then(resolveValue)
    .should('equal', true);
});
