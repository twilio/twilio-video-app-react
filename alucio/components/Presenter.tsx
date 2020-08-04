import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { luxColors, Iffy } from '@alucio/lux-ui';
import {
  LocalVideoPreview,
  useParticipantNetworkQualityLevel,
  useRoomState,
  MainParticipant as CurrentUserParticipant,
  NetworkQualityLevel,
  LocalAudioLevelIndicator,
  useVideoContext,
} from '../main';

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: '70%',
    opacity: 0.8,
    height: '30%',
    width: '100%',
    backgroundColor: luxColors.basicBlack.primary,
    display: 'flex',
    flexDirection: 'row',
  },
  mic: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  network: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  participant: {
    alignSelf: 'center',
    width: 256,
    height: 144,
    marginTop: 10,
  },
  participantNameContainer: {
    flexGrow: 5,
    flexDirection: 'column',
    alignSelf: 'center',
    width: 90,
    overflow: 'hidden',
  },
  participantName: {
    color: luxColors.info.primary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
  },
});

function NetworkWrapper() {
  const { room: { localParticipant } } = useVideoContext();

  if (!localParticipant) {
    return null;
  }

  const networkQualityLevel = useParticipantNetworkQualityLevel(localParticipant);
  return <NetworkQualityLevel qualityLevel={networkQualityLevel || 3} />;
}

function ParticipantName() {
  const { room: { localParticipant } } = useVideoContext();
  // All Video Participant IDs are in the form <attendeeId>.<participantType>.<Name>
  const name = localParticipant?.identity?.split('.')[2];
  return (
    <Text style={styles.participantName} numberOfLines={1}>
      {name}
    </Text>
  );
}

type PresenterProps = {
  styles?: any,
  hideParticipantName?: boolean
}

function Presenter(props: PresenterProps) {
  const roomState = useRoomState();
  return (
    <View style={[styles.participant, props.styles]}>
      {roomState === 'disconnected' ? <LocalVideoPreview /> : <CurrentUserParticipant />}
      <Iffy is={props.hideParticipantName === false}>
        <View style={styles.controls}>
          <View style={styles.participantNameContainer}>
            {
              roomState !== 'disconnected'
                ? <ParticipantName />
                : <Text style={styles.participantName}>Connecting.....</Text>
            }
          </View>
          <View style={styles.mic}>
            <LocalAudioLevelIndicator />
          </View>
          <View style={styles.network}>{roomState !== 'disconnected' && <NetworkWrapper />}</View>
        </View>
      </Iffy>
    </View>
  );
}

Presenter.defaultProps = {
  hideParticipantName: false,
}

export default Presenter;
