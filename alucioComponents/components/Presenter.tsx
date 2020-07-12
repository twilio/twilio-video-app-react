import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { luxColors } from '@alucio/lux-ui';
import {
  LocalVideoPreview,
  useMainSpeaker,
  useParticipantNetworkQualityLevel,
  useRoomState,
  MainParticipant as CurrentUserParticipant,
  NetworkQualityLevel,
  LocalAudioLevelIndicator,
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
  const mainParticipant = useMainSpeaker();
  const networkQualityLevel = useParticipantNetworkQualityLevel(mainParticipant);
  return <NetworkQualityLevel qualityLevel={networkQualityLevel || 3} />;
}

function ParticipantName() {
  const mainParticipant = useMainSpeaker();
  return (
    <Text style={styles.participantName} numberOfLines={1}>
      {mainParticipant.identity}
    </Text>
  );
}

function Presenter() {
  const roomState = useRoomState();

  return (
    <View style={styles.participant}>
      {roomState === 'disconnected' ? <LocalVideoPreview /> : <CurrentUserParticipant />}
      <View style={styles.controls}>
        <View style={styles.participantNameContainer}>{roomState !== 'disconnected' && <ParticipantName />}</View>
        <View style={styles.mic}>
          <LocalAudioLevelIndicator />
        </View>
        <View style={styles.network}>{roomState !== 'disconnected' && <NetworkWrapper />}</View>
      </View>
    </View>
  );
}

export default Presenter;