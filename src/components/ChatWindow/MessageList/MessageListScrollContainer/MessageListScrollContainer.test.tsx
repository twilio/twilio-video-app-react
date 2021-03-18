import React from 'react';
import MessageListScrollContainer from './MessageListScrollContainer';

//need to test that notification shows when new message comes in and scrolled up
//need to test that notification goes away when clicked on and scroll to the bottom
//need to test that autoscroll to bottom when already at the bottom

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
];

Object.defineProperty(Element, 'clientHeight', { value: 200 });
