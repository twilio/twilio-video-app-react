import { EventEmitter } from 'events';

class MockRoom extends EventEmitter {
  state = 'connected';
  disconnect = jest.fn();
  localParticipant = {
    publishTrack: jest.fn(),
    videoTracks: [{ setPriority: jest.fn() }],
  };
}

const mockRoom = new MockRoom();

class MockTrack extends EventEmitter {
  kind = '';
  stop = jest.fn();

  constructor(kind: string) {
    super();
    this.kind = kind;
  }
}

const twilioVideo = {
  connect: jest.fn(() => Promise.resolve(mockRoom)),
  createLocalTracks: jest.fn(() => Promise.resolve([new MockTrack('video'), new MockTrack('audio')])),
  createLocalVideoTrack: jest.fn(() => Promise.resolve(new MockTrack('video'))),
};

export { mockRoom };
export default twilioVideo;
