import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@alucio/lux-ui';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    height: '100%',
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    color: 'rgba(255,255,255,0.4)',
  },
});

export default function ParticipantMeetingPlaceholder() {
  return (
    <View style={styles.container}>
      <Icon style={styles.icon} name="account" />
    </View>
  );
}
