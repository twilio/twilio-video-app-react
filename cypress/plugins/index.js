const puppeteer = require('puppeteer');
const participants = {};

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing).
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
module.exports = (on, config) => {
  const participantFunctions = {
    addParticipant: async ({ name, roomName, color }) => {
      const args = ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'];

      if (color) {
        args.push(`--use-file-for-fake-video-capture=cypress/fixtures/${color}.y4m`);
      }

      const browser = await puppeteer.launch({
        headless: true,
        args,
      });
      const page = (participants[name] = await browser.newPage()); // keep track of this participant for future use
      await page.goto(config.baseUrl);
      await page.type('#menu-name', name);
      await page.type('#menu-room', roomName);
      await page.click('[type="submit"]');
      await page.waitForSelector('[data-cy-main-participant] video');
      return Promise.resolve(null);
    },
    toggleParticipantAudio: async name => {
      const page = participants[name];
      await page.click('body'); // To make controls reappear
      await page.click('[data-cy-audio-toggle]');
      return Promise.resolve(null);
    },
    shareParticipantScreen: async name => {
      const page = participants[name];
      await page.click('body');
      await page.click('[title="Share Screen"]');
      return Promise.resolve(null);
    },
    removeParticipant: async name => {
      const page = participants[name];
      await page.click('body');
      await page.click('[title="End Call"]');
      await page.close();
      delete participants[name];
      return Promise.resolve(null);
    },
    removeAllParticipants: () => {
      return Promise.all(Object.keys(participants).map(name => participantFunctions.removeParticipant(name))).then(
        () => null
      );
    },
    participantCloseBrowser: async name => {
      const page = participants[name];
      await page.close({ runBeforeUnload: true });
      delete participants[name];
      return Promise.resolve(null);
    },
  };
  on('task', participantFunctions);
};
