import { action } from '@storybook/addon-actions';
import EventEmitter from 'events';

class MockTrack extends EventEmitter {
  constructor(kind) {
    super();
    this.name = kind;
    this.kind = kind === 'video-composer-presentation' || kind === 'video' ? 'video' : 'audio';
    this.isEnabled = true;
    this.isSwitchedOff = false;
  }

  attach(el) {
    if (this.kind === 'video') {
      el.loop = true;
      if (this.name === 'video-composer-presentation') {
        // Change this URL to change the aspect ratio of the image.
        // To use a video source, set the 'el.src' property instead and uncomment el.play() below
        el.poster = 'https://dummyimage.com/800x450/c25050/ffffff.png&text=Screen+share';
      } else {
        el.poster = 'https://dummyimage.com/800x450/439e3a/ffffff.png&text=Participant';
      }
      try {
        // el.play();
      } catch {}
    }
  }

  detach(el) {
    el.src = '';
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
    this.kind = kind === 'video-composer-presentation' || kind === 'video' ? 'video' : 'audio';
    this.track = new MockTrack(kind);
    this.trackName = kind;
  }
}

class MockRoom extends EventEmitter {
  name = 'test room';
  participants = new Map();
  dominantSpeaker = null;
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
      mockRoom.emit('trackPublished', publication, this);
    }
  }

  unpublishTrack(kind) {
    const publication = this.tracks.get(kind);
    if (publication) {
      this.tracks.delete(kind);
      this.emit('trackUnsubscribed', publication.track);
      mockRoom.emit('trackUnpublished', publication, this);
    }
  }
}

let isConnected = false;

export const connect = (...params) => {
  action('Connected to Twilio Video Room')(...params);
  if (!isConnected) {
    isConnected = true;
    return Promise.resolve(mockRoom);
  } else {
    return Promise.reject('Already connected to mock Twilio Room');
  }
};

// The decorator to be used in ./storybook/preview to apply the mock to all stories
export function decorator(story, { args }) {
  for (let i = 1; i <= 15; i++) {
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
          mockParticipant.publishTrack('video-composer-presentation');
        } else {
          mockParticipant.unpublishTrack('video-composer-presentation');
        }
      } else {
        mockParticipant.unpublishTrack('video-composer-presentation');
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
