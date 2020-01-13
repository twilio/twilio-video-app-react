import { EventEmitter } from 'events';

class MockRoom extends EventEmitter {
  state = 'connected';
  disconnect = jest.fn();
  localParticipant = {
    publishTrack: jest.fn(),
  };
}

const mockRoom = new MockRoom();

const twilioVideo = {
  connect: jest.fn(() => Promise.resolve(mockRoom)),
  createLocalAudioTrack: jest.fn(() => Promise.resolve(new EventEmitter())),
  createLocalVideoTrack: jest.fn(() => Promise.resolve(new EventEmitter())),
};

export { mockRoom };
export default twilioVideo;
