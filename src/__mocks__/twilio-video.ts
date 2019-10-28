import { EventEmitter } from 'events';

class MockRoom extends EventEmitter {
  state = 'connected';
  disconnect = jest.fn();
}

class mockTwilioVideo {
  connect = jest.fn(() => Promise.resolve(new MockRoom()));
  createLocalTracks = jest.fn(() => Promise.resolve(['mockTrack']));
}

module.exports = new mockTwilioVideo();
