import React from 'react';
import { render } from '@testing-library/react';
import MessageList from './MessageList';

jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => ({
  room: { localParticipant: { identity: 'olivia' } },
}));

const arbitraryDate = new Date(1614635301000);

const messages: any = [
  {
    author: 'olivia',
    dateCreated: arbitraryDate,
    body: 'This is a message',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: arbitraryDate,
    body: 'Hi Olivia!',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: arbitraryDate,
    body: 'That is pretty rad double line message! How did you do that?',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: arbitraryDate,
    body: '😉',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4',
    type: 'text',
  },
  {
    author: 'olivia',
    dateCreated: new Date(1614635361000),
    body: 'Magic',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5',
    type: 'text',
  },
  {
    author: 'olivia',
    dateCreated: new Date(1614635361000),
    body: 'lots of magic',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX6',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635361000),
    body: 'look at this app: github.com/twilio/twilio-video-app-react. Neat huh?',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX7',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635361000),
    media: {
      filename: 'test1.txt',
      size: 123456,
    },
    type: 'media',
  },
];

describe('the messageList component', () => {
  it('should render correctly', () => {
    const { container } = render(<MessageList messages={messages} />);
    expect(container).toMatchSnapshot();
  });
});
