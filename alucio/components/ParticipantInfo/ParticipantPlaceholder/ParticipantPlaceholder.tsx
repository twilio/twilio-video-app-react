import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@alucio/lux-ui';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    color: 'rgba(255,255,255,0.4)',
  },
});

export default function ParticipantPlaceholder() {
  return (
    <View style={styles.container}>
      <Icon style={styles.icon} name="account" />
    </View>
  );
}
