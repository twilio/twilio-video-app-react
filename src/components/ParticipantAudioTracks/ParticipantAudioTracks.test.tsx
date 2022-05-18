import React from 'react';
import { EventEmitter } from 'events';
import { mount } from 'enzyme';
import { ParticipantAudioTracks } from './ParticipantAudioTracks';
import useParticipants from '../../hooks/useParticipants/useParticipants';

function MockAudioTrack() {
  return <div>Mock Audio Track</div>;
}

jest.mock('../../hooks/useParticipants/useParticipants');
jest.mock('../AudioTrack/AudioTrack', () => MockAudioTrack);

const mockUseParticipants = useParticipants as jest.Mock<any>;

class MockParticipant extends EventEmitter {
  sid: string;
  tracks: any;

  constructor(tracks: any) {
    super();
    this.sid = Math.random().toString();
    this.tracks = new Map(tracks);
  }
}

mockUseParticipants.mockImplementation(() => [
  new MockParticipant([
    ['audio', { track: { kind: 'audio' } }],
    ['video', { track: { kind: 'video' } }],
  ]),
  new MockParticipant([['audio', { track: { kind: 'audio' } }]]),
  new MockParticipant([['video', { track: { kind: 'video' } }]]), // No MockAudioTracks will be rendered for this participant
]);

describe('the ParticipantAudioTracks component', () => {
  it('should render the audio tracks for all participants', () => {
    const wrapper = mount(<ParticipantAudioTracks />);
    expect(wrapper.find(MockAudioTrack).length).toBe(2);
  });
});
