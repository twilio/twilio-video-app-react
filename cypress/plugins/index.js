const puppeteer = require('puppeteer');
const participants = {};

const participantFunctions = {
  addParticipant: async ({ name, roomName, color }) => {
    const args = ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'];

    if (color) {
      args.push(`--use-file-for-fake-video-capture=cypress/fixtures/${color}.y4m`);
    }

    const browserOptions = {
      headless: true,
      args,
    };

    // Prevents annoying popups about permissions from appearing when running tests locally 
    if (process.env.CI !== 'true') {
      browserOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    const browser = await puppeteer.launch(browserOptions);
    const page = (participants[name] = await browser.newPage()); // keep track of this participant for future use
    await page.goto('http://localhost:3000');
    await page.type('#menu-name', name);
    await page.type('#menu-room', roomName);
    await page.click('[type="submit"]');
    await page.waitForSelector('[data-cy-main-participant] video');
    return Promise.resolve(null);
  },
  muteParticipantAudio: async name => {
    const page = participants[name];
    await page.click('[title="Mute Audio"]');
    return Promise.resolve(null);
  },
  shareParticipantScreen: async name => {
    const page = participants[name];
    await page.click('[title="Share Screen"]');
    return Promise.resolve(null);
  },
  removeParticipant: async name => {
    const page = participants[name];
    await page.click('[title="End Call"]');
    await page.close();
    delete participants[name];
    return Promise.resolve(null);
  },
  removeAllParticipants: function async(name) {
    return Promise.all(Object.keys(participants).map(name => participantFunctions.removeParticipant(name))).then(
      () => null
    );
  },
};

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing).
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
module.exports = (on, config) => {
  on('task', participantFunctions);
};
