import { action } from '@storybook/addon-actions';
import EventEmitter from 'events';

Object.defineProperty(navigator, 'permissions', { value: false });

navigator.mediaDevices.enumerateDevices = () => Promise.resolve([]);

const oldFetch = window.fetch;
window.fetch = (...args) => {
  console.log(args);
  if (args[0] === '/token') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ token: 'yay' }),
    });
  } else {
    return oldFetch(...args);
  }
};

const getRandomColor = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

class MockTrack extends EventEmitter {
  constructor(kind) {
    super();
    this.name = kind;
    this.kind = kind === 'screen' || kind === 'video' ? 'video' : 'audio';
    this.isEnabled = true;
    this.isSwitchedOff = false;
    this.backgroundColor = getRandomColor();

    this._dummyAudioEl_ = document.createElement('audio');
  }

  attach(el) {
    if (this.kind === 'video') {
      el.loop = true;
      if (this.name === 'screen') {
        // Change this URL to change the aspect ratio of the image.
        // To use a video source, set the 'el.src' property instead and uncomment el.play() below
        el.poster = 'https://dummyimage.com/800x450/c25050/ffffff.png&text=Screen+share';
      } else {
        el.poster = `https://dummyimage.com/800x450/${this.backgroundColor}/ffffff.png&text=Participant`;
      }
      try {
        // el.play();
      } catch {}
    } else {
      return this._dummyAudioEl_;
    }
  }

  detach(el) {
    if (el?.src) {
      el.src = '';
    }

    if (!el) return [this._dummyAudioEl_];
  }

  disable() {
    this.isEnabled = false;
    this.emit('disabled');
  }

  enable() {
    this.isEnabled = true;
    this.emit('enabled');
  }

  switchOff() {
    this.isSwitchedOff = true;
    this.emit('switchedOff');
  }

  switchOn() {
    this.isSwitchedOff = false;
    this.emit('switchedOn');
  }
}

class MockPublication extends EventEmitter {
  constructor(kind) {
    super();
    this.kind = kind === 'screen' || kind === 'video' ? 'video' : 'audio';
    this.track = new MockTrack(kind);
    this.trackName = kind;
    this.setPriority = () => {};
  }
}

class LocalParticipant extends EventEmitter {
  constructor() {
    super();
    const videoPublication = new MockPublication('video');
    const audioPublication = new MockPublication('audio');

    this.videoTracks = new Map([['video', videoPublication]]);
    this.audioTracks = new Map([['audio', audioPublication]]);
    this.tracks = new Map([
      ['video', videoPublication],
      ['audio', audioPublication],
    ]);

    this.identity = 'Local Participant';
  }
}

class MockRoom extends EventEmitter {
  name = 'test room';
  participants = new Map();
  dominantSpeaker = null;
  state = 'connected';
  localParticipant = new LocalParticipant();
  disconnect = () => {};
}

const mockRoom = new MockRoom();

class MockParticipant extends EventEmitter {
  constructor(name) {
    super();
    this.identity = name;
    this.tracks = new Map([
      ['video', new MockPublication('video')],
      ['audio', new MockPublication('audio')],
    ]);
  }

  publishTrack(kind) {
    if (!this.tracks.get(kind)) {
      const publication = new MockPublication(kind);
      this.tracks.set(kind, publication);
      this.emit('trackSubscribed', publication.track);
      this.emit('trackPublished', publication);
      mockRoom.emit('trackPublished', publication, this);
    }
  }

  unpublishTrack(kind) {
    const publication = this.tracks.get(kind);
    if (publication) {
      this.tracks.delete(kind);
      this.emit('trackUnsubscribed', publication.track);
      this.emit('trackUnpublished', publication);
      mockRoom.emit('trackUnpublished', publication, this);
    }
  }
}

let isConnected = false;

export const connect = (...params) => {
  action('Connected to Twilio Video Room')(...params);
  if (!isConnected) {
    isConnected = true;
    return new Promise(resolve => {
      setTimeout(() => resolve(mockRoom), 1000);
    });
  } else {
    return Promise.reject('Already connected to mock Twilio Room');
  }
};

const defaults = {
  isSupported: true,
  connect,
};

export default defaults;

// Disable conversations
process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS = 'true';

// The decorator to be used in ./storybook/preview to apply the mock to all stories
export function decorator(story, { args }) {
  for (let i = 1; i <= 200; i++) {
    const identity = `test-${i}`;

    if (i <= args.participants) {
      if (!mockRoom.participants.has(identity)) {
        const mockParticipant = new MockParticipant(identity);
        mockRoom.participants.set(identity, mockParticipant);
        mockRoom.emit('participantConnected', mockParticipant);
      }
    } else if (mockRoom.participants.has(identity)) {
      const mockParticipant = mockRoom.participants.get(identity);
      mockRoom.participants.delete(identity);
      mockRoom.emit('participantDisconnected', mockParticipant);
    }

    const mockParticipant = mockRoom.participants.get(identity);

    if (mockParticipant) {
      const audioTrack = mockParticipant.tracks.get('audio')?.track;
      const videoTrack = mockParticipant.tracks.get('video')?.track;

      if (args.presentationParticipant) {
        // The presentationParticipant string can be a comma-delimited list of numbers
        // to simulate multiple users with published presentation tracks.
        const presentationList = args.presentationParticipant.split(',');

        if (presentationList.includes(i.toString())) {
          mockParticipant.publishTrack('screen');
        } else {
          mockParticipant.unpublishTrack('screen');
        }
      } else {
        mockParticipant.unpublishTrack('screen');
      }

      if (args.disableAllAudio) {
        audioTrack?.disable();
      } else {
        audioTrack?.enable();
      }

      if (args.disableAllVideo) {
        videoTrack?.disable();
      } else {
        videoTrack?.enable();
      }

      if (args.unpublishAllAudio) {
        mockParticipant.unpublishTrack('audio');
      } else {
        mockParticipant.publishTrack('audio');
      }

      if (args.unpublishAllVideo) {
        mockParticipant.unpublishTrack('video');
      } else {
        mockParticipant.publishTrack('video');
      }

      if (args.switchOffAllVideo) {
        videoTrack?.switchOff();
      } else {
        videoTrack?.switchOn();
      }
    }
  }

  const dominantSpeakerIdentity = `test-${args.dominantSpeaker}`;

  if (mockRoom.participants.has(dominantSpeakerIdentity)) {
    const mockParticipant = mockRoom.participants.get(dominantSpeakerIdentity);
    mockRoom.dominantSpeaker = mockParticipant;
    mockRoom.emit('dominantSpeakerChanged', mockParticipant);
  } else {
    mockRoom.dominantSpeaker = null;
    mockRoom.emit('dominantSpeakerChanged', null);
  }

  return story();
}
