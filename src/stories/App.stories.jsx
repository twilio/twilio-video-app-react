import { ReactApp } from '..';

export default {
  title: 'App',
  component: ReactApp,
  layout: 'fullscreen',
  argTypes: {
    participants: {
      control: { type: 'range', min: 0, max: 200, step: 1 },
    },
    dominantSpeaker: {
      control: { type: 'text' },
    },
    presentationParticipant: {
      control: { type: 'text' },
    },
    disableAllAudio: {
      control: { type: 'boolean' },
    },
    unpublishAllAudio: {
      control: { type: 'boolean' },
    },
    unpublishAllVideo: {
      control: { type: 'boolean' },
    },
    switchOffAllVideo: {
      control: { type: 'boolean' },
    },
  },
};

const Template = args => <ReactApp {...args} />;

export const Prod = Template.bind({});
Prod.args = {
  participants: 1,
  dominantSpeaker: null,
  presentationParticipant: null,
  disableAllAudio: false,
  unpublishAllAudio: false,
  unpublishAllVideo: false,
  switchOffAllVideo: false,
};
