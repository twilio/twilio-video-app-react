/// <reference types="Cypress" />

// If you are on MacOS and have many popups about Chromium when these tests run, please see: https://stackoverflow.com/questions/54545193/puppeteer-chromium-on-mac-chronically-prompting-accept-incoming-network-connect
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

const baseLoginUrl = "http://tabula-mt-intg-01.escribers.io/tabula/welcome";
const baseConferenceUrl = "http://tabula-mt-intg-01.escribers.io/tabula/conference/newconference";
const getRoomName = () =>
    Math.random()
        .toString(36)
        .slice(2);
const uuid = () => Cypress._.random(0, 1e6)
const statusValues = ['In_progress','Completed','Scheduled'];
const providers = ['Twilio Video','Twilio Telephone'];
const roles = ['Parent','Parent Representative','District Representative','Other','Interpreter'];
const caseRef = uuid();

 context('Startup', () => {
    
      before(() => { 
                  cy.tabulaLogin(baseConferenceUrl,'yehuda','CleanCode18%');
                  const nowDate = Cypress.moment();
                  cy.createNewConference(baseConferenceUrl,caseRef,`caseName-${caseRef}`,nowDate.format('yyyy-MM-DD') ,
                  nowDate.format('HH:mm:ss'), nowDate.add(1000000).format('HH:mm:ss'),providers[0],
                  statusValues[ getRandomInt(0,statusValues.length - 1)],`reporter-${caseRef}`,
                  getRandomInt(48,90).toString());
                });

      beforeEach(() => {  
                   cy.visit(`${baseLoginUrl}/login/`);
                });
     
      it('should fill login form and get error of "no active hearing for the case number"', () => {

            cy.fillLoginPage('abfhg','123$567','1313');

            cy.url().should('eq', `${baseLoginUrl}/login/nohearing`);
            cy.get('p').contains('There is no active hearing for the case number you entered.').should('be.visible');
          })
      
      it('should fill login form and redirect to twilio video app', () => {

            cy.fillLoginPage('bhaidar','123$567',caseRef);
            cy.url().should('eq', `${baseLoginUrl}/chooseRole`);
            cy.get('select[name="roleId"]').select(roles[getRandomInt(0,statusValues.length - 1)]);
            cy.get('form').submit();

            cy.url().should('include', '.cloudfront.net/');
            cy.log("url" + cy.url());
      })
           
    }); 




    // context('A video app user', () => {
 
//   describe('before entering a room', () => {

//     it('should see their audio level indicator moving in the media device panel', () => {
//       cy.visit('/');
//       cy.get('clipPath rect')
//           .invoke('attr', 'y')
//           .should('be', 21);
//       cy.get('clipPath rect')
//           .invoke('attr', 'y')
//           .should('be.lessThan', 21);
//     });
//   });

//   describe('when entering an empty room that one participant will join', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.joinRoom('Hearing Officer','partyName' ,ROOM_NAME);
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME });
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     it('****WORKING TEST****: should be inside the correct room', () => {

//       cy.on('uncaught:exception', (err, runnable) => {
//         //expect(err.message).to.include('something about the error')

//         // using mocha's async done callback to finish
//         // this test so we prove that an uncaught exception was thrown
//         done()

//         // return false to prevent the error from failing this test
//         console.log(err);
//         return false
//       })
//       cy.get('header').should('contain', ROOM_NAME);
//       cy.getParticipant('testuser@Hearing Officer').should('contain', 'testuser');
//     });

//     // it('should be able to see the other participant', () => {
//     //   cy.get('[data-cy-main-participant]').should('contain', 'test1');
//     //   cy.getParticipant('test1')
//     //     .should('contain', 'test1')
//     //     .shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });

//     // it('should be able to hear the other participant', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     // });

//     // it('should see the participants audio level indicator moving', () => {
//     //   cy.getParticipant('test1')
//     //     .get('clipPath rect')
//     //     .invoke('attr', 'y')
//     //     .should('be', 21);
//     //   cy.get('clipPath rect')
//     //     .invoke('attr', 'y')
//     //     .should('be.lessThan', 21);
//     // });

//     // it('should see other participants disconnect when they close their browser', () => {
//     //   cy.task('participantCloseBrowser', 'test1');
//     //   cy.getParticipant('test1').should('not.exist');
//     //   cy.get('[data-cy-main-participant]').should('contain', 'testuser');
//     // });
//   });

//   describe('when entering a room with one participant', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME });
//       cy.joinRoom('testuser', ROOM_NAME);
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     // it('should be able to see the other participant', () => {
//     //   cy.get('[data-cy-main-participant]').should('contain', 'test1');
//     //   cy.getParticipant('test1')
//     //       .should('contain', 'test1')
//     //       .shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });

//     // it('should be able to hear the other participant', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     // });
//   });

//   describe('when entering an empty room that three participants will join', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.joinRoom('testuser', ROOM_NAME);
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME, color: 'red' });
//       cy.task('addParticipant', { name: 'test2', roomName: ROOM_NAME, color: 'blue' });
//       cy.task('addParticipant', { name: 'test3', roomName: ROOM_NAME, color: 'green' });
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     // it('should be able to see the other participants', () => {
//     //   cy.getParticipant('test1')
//     //       .should('contain', 'test1')
//     //       .shouldBeColor('red');
//     //   cy.getParticipant('test2')
//     //       .should('contain', 'test2')
//     //       .shouldBeColor('blue');
//     //   cy.getParticipant('test3')
//     //       .should('contain', 'test3')
//     //       .shouldBeColor('green');
//     // });

//     // it('should be able to hear the other participants', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     //   cy.getParticipant('test2').shouldBeMakingSound();
//     //   cy.getParticipant('test3').shouldBeMakingSound();
//     // });
//   });

//   describe('when entering a room with three participants', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME, color: 'red' });
//       cy.task('addParticipant', { name: 'test2', roomName: ROOM_NAME, color: 'blue' });
//       cy.task('addParticipant', { name: 'test3', roomName: ROOM_NAME, color: 'green' });
//       cy.joinRoom('testuser', ROOM_NAME);
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     // it('should be able to see the other participants', () => {
//     //   cy.getParticipant('test1')
//     //       .should('contain', 'test1')
//     //       .shouldBeColor('red');
//     //   cy.getParticipant('test2')
//     //       .should('contain', 'test2')
//     //       .shouldBeColor('blue');
//     //   cy.getParticipant('test3')
//     //       .should('contain', 'test3')
//     //       .shouldBeColor('green');
//     // });

//     // it('should be able to hear the other participants', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     //   cy.getParticipant('test2').shouldBeMakingSound();
//     //   cy.getParticipant('test3').shouldBeMakingSound();
//     // });

//     // it('should see participant "test1" when they are the dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test2');
//     //   cy.task('toggleParticipantAudio', 'test3');
//     //   cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test1').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });
//     //
//     // it('should see participant "test2" when they are the dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test1');
//     //   cy.task('toggleParticipantAudio', 'test2');
//     //   cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test2').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });
//     //
//     // it('should see participant "test3" when they are the dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test2');
//     //   cy.task('toggleParticipantAudio', 'test3');
//     //   cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });
//     //
//     // it('should see participant "test3" when there is no dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test3');
//     //   cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });

//   });
// });
