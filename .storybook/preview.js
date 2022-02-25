import { decorator as TwilioVideoMockDecorator } from '../src/stories/mocks/twilio-video.js';

// Add the decorator to all stories
export const decorators = [TwilioVideoMockDecorator];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
};
