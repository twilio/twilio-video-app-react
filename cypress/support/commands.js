import detectSound from './detectSound';

Cypress.Commands.add('tabulaLogin', (conferenceUrl,userName, password) => {
       cy.visit(conferenceUrl);
       cy.get('input[id="username"]').type(userName).should('have.value', userName);
       cy.get('input[id="password"]').type(password).should('have.value', password);
       cy.get('[id="loginform"]').submit();
       cy.url().should('eq', conferenceUrl);
           
});

Cypress.Commands.add('createNewConference', (conferenceUrl,caseRef,caseName,hearingDate,startTime,endTime,
  provider,status,hearingOfficer,reporterPerson) => {
  cy.get('input[id="case_reference"]').type(caseRef).should('have.value', caseRef);
  cy.get('input[id="case_name"]').type(caseName).should('have.value', caseName);
  cy.get('input[id="hearing_date"]').type(hearingDate).should('have.value', hearingDate);
  cy.get('input[id="start_time"]').type(startTime).should('have.value', startTime);
  cy.get('input[id="end_time"]').type(endTime).should('have.value', endTime);
  cy.get('[id="provider_id"]').select(provider);
  cy.get('[id="status_id"]').select(status);
  cy.get('input[id="hearing_officer"]').type(hearingOfficer).should('have.value', hearingOfficer);
  cy.get('[id="reporter_person_id"]').select(reporterPerson);
  cy.get('div[id="newconference"]').find('form').submit();
  cy.get('p').contains('Conference created OK.').should('be.visible');
  cy.url().should('include', conferenceUrl);
        
});

Cypress.Commands.add('fillLoginPage', (userName,pass, caseNumber) => {

  cy.get('[name="name"]').type(userName).should('have.value', userName);
  cy.get('[name="passPin"]').type(pass).should('have.value', pass);
  cy.get('[name="legalCaseReference"]').type(caseNumber).should('have.value', caseNumber);
  cy.get('form').submit();

});

Cypress.Commands.add('joinRoom', (partyType,partyName, caseNumber) => {
  cy.visit('/');
  cy.get('[data-cy="select"]').click();
  cy.get('[data-cy="menu-item"]').eq(1).click();
  cy.get('#case-number').type(caseNumber);
  cy.get('#party-name').type(partyName);
  cy.get('[type="submit"]').click();
  cy.get('[data-cy-main-participant]');
});

Cypress.Commands.add('leaveRoom', () => {
  cy.wait(500);
  cy.get('body').click(); // Makes controls reappear
  cy.get('#endCall').click();
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
