import { EventEmitter } from 'events';

class MockRoom extends EventEmitter {
  state = 'connected';
  disconnect = jest.fn();
}

class MockTwilioVideo {
  connect = jest.fn(() => Promise.resolve(new MockRoom()));
  createLocalTracks = jest.fn(() => Promise.resolve(['mockTrack']));
}

const twilioVideo = new MockTwilioVideo();

export default twilioVideo;
