import { ConnectOptions } from 'twilio-video';
import { isMobile, removeUndefineds } from '..';
import { useAppState } from '../../state';

export default function useConnectionOptions() {
  const { settings } = useAppState();

  // See: https://sdk.twilio.com/js/video/releases/2.0.0/docs/global.html#ConnectOptions
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
        trackSwitchOffMode: settings.trackSwitchOffMode,
        contentPreferencesMode: settings.contentPreferencesMode,
        clientTrackSwitchOffControl: settings.clientTrackSwitchOffControl,
      },
    },
    dominantSpeaker: true,
    networkQuality: { local: 1, remote: 1 },

    // Comment this line if you are playing music.
    maxAudioBitrate: Number(settings.maxAudioBitrate),

    preferredVideoCodecs: 'auto',

    //@ts-ignore - Internal use only. This property is not exposed in type definitions.
    environment: process.env.REACT_APP_TWILIO_ENVIRONMENT,
  };

  // For mobile browsers, limit the maximum incoming video bitrate to 2.5 Mbps.
  if (isMobile && connectionOptions?.bandwidthProfile?.video) {
    connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
  }

  if (process.env.REACT_APP_TWILIO_ENVIRONMENT === 'dev') {
    //@ts-ignore - Internal use only. This property is not exposed in type definitions.
    connectionOptions!.wsServer = 'wss://us2.vss.dev.twilio.com/signaling';
  }

  // Here we remove any 'undefined' values. The twilio-video SDK will only use defaults
  // when no value is passed for an option. It will throw an error when 'undefined' is passed.
  return removeUndefineds(connectionOptions);
}
