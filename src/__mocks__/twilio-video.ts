import { EventEmitter } from 'events';

class MockRoom extends EventEmitter {
  state = 'connected';
  disconnect = jest.fn();
}

class MockTwilioVideo {
  connect = jest.fn(() => Promise.resolve(new MockRoom()));
  createLocalAudioTrack = jest.fn(() => Promise.resolve(new EventEmitter()));
  createLocalVideoTrack = jest.fn(() => Promise.resolve(new EventEmitter()));
}

const twilioVideo = new MockTwilioVideo();

export default twilioVideo;
