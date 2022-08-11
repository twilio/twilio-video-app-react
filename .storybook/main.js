module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', {
    name: '@storybook/addon-essentials',
    options: {
      backgrounds: false,
      docs: false
    }
  }, '@storybook/preset-create-react-app'],
  framework: '@storybook/react',
  webpackFinal: config => {
    config.resolve.alias['twilio-video'] = require.resolve('../src/stories/mocks/twilio-video.js');
    return config;
  },
  core: {
    builder: 'webpack5'
  }
};