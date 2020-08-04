import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { luxColors } from '@alucio/lux-ui';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  screenShare: {
    flexGrow: 1,
    alignSelf: 'center',
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeText: {
    alignSelf: 'center',
    color: luxColors.info.primary,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 46,
  },
  welcomeTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
})

interface ShareContentProps {
  background : any
}

function ShareContent(props:ShareContentProps) {
  return (
    <View style={styles.screenShare}>
      <ImageBackground
        source={props.background}
        style={styles.backgroundImage}
      >
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome To The Meeting</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

export default ShareContent;
