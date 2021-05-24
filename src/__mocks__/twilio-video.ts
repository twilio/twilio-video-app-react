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
  mediaStreamTrack = { getSettings: () => ({ deviceId: 'mockDeviceId' }) };

  constructor(kind: string) {
    super();
    this.kind = kind;
  }
}

const twilioVideo = {
  connect: jest.fn(() => Promise.resolve(mockRoom)),
  createLocalTracks: jest.fn(
    // Here we use setTimeout so we can control when this function resolves with jest.runAllTimers()
    () => new Promise(resolve => setTimeout(() => resolve([new MockTrack('video'), new MockTrack('audio')])))
  ),
  createLocalVideoTrack: jest.fn(() => new Promise(resolve => setTimeout(() => resolve(new MockTrack('video'))))),
};

export { mockRoom };
export default twilioVideo;
