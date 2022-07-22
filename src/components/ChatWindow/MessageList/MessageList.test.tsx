import React from 'react';
import { render } from '@testing-library/react';
import MessageList from './MessageList';

jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => ({
  room: { localParticipant: { identity: 'olivia' } },
}));

const messages: any = [
  {
    author: 'olivia',
    dateCreated: new Date(1614635301000),
    body: 'This is a message',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635302000),
    body: 'Hi Olivia!',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635303000),
    body: 'That is pretty rad double line message! How did you do that?',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635383000),
    body: '😉',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4',
    type: 'text',
  },
  {
    author: 'olivia',
    dateCreated: new Date(1614635389000),
    body: 'Magic',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5',
    type: 'text',
  },
  {
    author: 'olivia',
    dateCreated: new Date(1614635410000),
    body: 'lots of magic',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX6',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635425000),
    body: 'look at this app: github.com/twilio/twilio-video-app-react. Neat huh?',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX7',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: new Date(1614635361000),
    attachedMedia: [
      {
        filename: 'test1.txt',
        size: 123456,
      },
    ],
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX8',
    type: 'media',
  },
];

describe('the messageList component', () => {
  it('should render correctly', () => {
    const { container } = render(<MessageList messages={messages} />);
    expect(container).toMatchSnapshot();
  });
});
