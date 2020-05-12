import { ConnectOptions } from 'twilio-video';
import { isMobile, removeUndefineds } from './utils/utils';
import { Settings } from './state/settings/settingsReducer';

const resolutionMap = {
  high: { height: 1080, width: 1920 },
  standard: { height: 720, width: 1280 },
  low: { height: 90, width: 160 },
  default: undefined,
};

function getNumber(val: string) {
  return val === '' ? undefined : Number(val);
}

export default function generateConnectionOptions(settings: Settings) {
  // See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
  // for available connection options.
  const connectionOptions: ConnectOptions = {
    // Bandwidth Profile, Dominant Speaker, and Network Quality
    // features are only available in Small Group or Group Rooms.
    // Please set "Room Type" to "Group" or "Small Group" in your
    // Twilio Console: https://www.twilio.com/console/video/configure
    bandwidthProfile: {
      video: {
        mode: settings.bandwidthProfileMode,
        dominantSpeakerPriority: settings.dominantSpeakerPriority,
        renderDimensions: {
          low: resolutionMap[settings.renderDimensionLow],
          standard: resolutionMap[settings.renderDimensionStandard],
          high: resolutionMap[settings.renderDimensionHigh],
        },
        maxTracks: getNumber(settings.maxTracks),
      },
    },
    dominantSpeaker: true,
    networkQuality: { local: 1, remote: 1 },

    // Comment this line if you are playing music.
    maxAudioBitrate: getNumber(settings.maxAudioBitrate),

    // VP8 simulcast enables the media server in a Small Group or Group Room
    // to adapt your encoded video quality for each RemoteParticipant based on
    // their individual bandwidth constraints. This has no effect if you are
    // using Peer-to-Peer Rooms.
    preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
  };

  // For mobile browsers, limit the maximum incoming video bitrate to 2.5 Mbps.
  if (isMobile && connectionOptions?.bandwidthProfile?.video) {
    connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
  }

  return removeUndefineds(connectionOptions);
}
