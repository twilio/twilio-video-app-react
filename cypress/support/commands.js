import detectSound from './detectSound';

Cypress.Commands.add('joinRoom', (username, roomname) => {
  // These tests were written before Gallery View was implemented. This app now activates
  // Gallery View by default, so here we activate Speaker View before visiting the app so
  // that the tests can pass.
  cy.visit('/', {
    onBeforeLoad: window => {
      window.localStorage.setItem('gallery-view-active-key', false);
    },
  });
  cy.get('#input-user-name').type(username);
  cy.get('#input-room-name').type(roomname);
  cy.get('[type="submit"]').click();
  cy.get('[data-cy-join-now]').click();
  cy.get('[data-cy-main-participant]');
});

Cypress.Commands.add('leaveRoom', () => {
  cy.wait(500);
  cy.get('body').click(); // Makes controls reappear
  cy.get('footer [data-cy-disconnect]').click();
  cy.task('removeAllParticipants');
  cy.get('[type="submit"]');
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

function getParticipantAudioTrackName(name, window) {
  const participant = Array.from(window.twilioRoom.participants.values()).find(
    participant => participant.identity === name
  );
  const audioTrack = Array.from(participant.audioTracks.values())[0].track;
  return audioTrack.name;
}

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

  cy.window()
    .then(win => {
      const participantIdentity = subject.attr('data-cy-participant');
      const trackName = getParticipantAudioTrackName(participantIdentity, win);
      return win.document.querySelector(`[data-cy-audio-track-name="${trackName}"]`);
    })
    .then(resolveValue)
    .should('equal', true);
});
