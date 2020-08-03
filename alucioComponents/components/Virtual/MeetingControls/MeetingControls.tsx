import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, luxColors, util } from '@alucio/lux-ui';
import Menu, { MenuOption } from '../Menu/Menu';
import { useLocalAudioToggle, useLocalVideoToggle, useVideoContext, useRoomState, MODE_TYPE } from '../../../main';
import { virtualType } from '../VirtualExchange';

const styles = StyleSheet.create({
  endCall: {
    flex: 1,
    alignSelf: 'center',
    marginRight: 20,
    marginLeft: 5,
  },
  endCallButton: {
    backgroundColor: luxColors.error.primary,
    borderRadius: 30,
    zIndex: 1,
  },
  menu: {
    flex: 1,
    flexGrow: 15,
    flexDirection: 'row',
  },
  menuPlayer: {
    width: '38%',
    paddingStart: '3%',
  },
  menuActions: {
    width: '62%',
  },
  mic: {
    flex: 1,
  },
  name: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 5,
  },
  nameText: {
    color: luxColors.info.primary,
    marginLeft: 20,
    opacity: 0.6,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    minWidth: 74,
  },
  logo: {
    opacity: 0.1,
    backgroundColor: luxColors.thumbnailBorder.primary,
    position: 'absolute',
    width: 110,
    height: 130,
    top: '-80%',
    left: '-10%',
    transform: [
      { rotate: '-24deg' },
    ],
  },
})

let PresentationMenuOptions: MenuOption[] = [
  {
    active: false,
    title: 'My Content',
    icon: 'presentation-play',
  },
  {
    title: 'Chat',
    icon: 'chat',
  },
  {
    title: 'Notes',
    icon: 'note-text',
  },
];

interface HeadBarProps {
  mode: MODE_TYPE,
  displayContentPanel: boolean;
  onCallEnd: () => void;
  toggleHostNotes?: () => void;
  onShowContentPanel?: () => void;
  virtual: virtualType;
}

function MeetingControls(props: HeadBarProps) {
  const { virtual, mode } = props;
  PresentationMenuOptions[0].active = props.displayContentPanel;
  const roomState = useRoomState();
  const { room } = useVideoContext();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const exitButtonText = mode === 'Host' ? 'End' : 'Leave';

  if (mode === 'Guest') {
    // For the guest remove some options
    PresentationMenuOptions = PresentationMenuOptions.filter((e) => {
      return !(['My Content', 'News'].includes(e.title));
    })
  }

  function onPlayerSelectedOption(selected: MenuOption) {
    if (selected.title === 'Mute' || selected.title === 'Unmute') {
      toggleAudioEnabled();
    }
    else if (selected.title === 'Stop Video' || selected.title === 'Start Video') {
      toggleVideoEnabled();
    }
  }

  function onPresentationSelectedOption(selected: MenuOption): void {
    switch(selected.title) {
      case PresentationMenuOptions[0].title:
        props.onShowContentPanel && props.onShowContentPanel();
        break;

      case PresentationMenuOptions[2].title:
        props.toggleHostNotes && props.toggleHostNotes();
        break;
    }
  }
  const muteAudioOption: MenuOption = {
    title: 'Mute',
    icon: 'microphone',
  };
  if (!isAudioEnabled) {
    muteAudioOption.title = 'Unmute'
    muteAudioOption.icon = 'microphone-off'
  }
  const muteVideoOption: MenuOption = {
    title: 'Stop Video',
    icon: 'video'
  };
  if (!isVideoEnabled) {
    muteVideoOption.title = 'Start Video'
    muteVideoOption.icon = 'video-off'
  }
  const playerMenuOptions = [
    muteAudioOption,
    muteVideoOption,
    {
      title: 'Settings',
        icon: 'settings',
    }
  ];

  return (<>
    <View style={styles.name}>
      <Text style={styles.nameText}>
        Virtual Exchange
      </Text>
      <View style={styles.logo} />
    </View>
    <View style={styles.menu}>
      <View style={styles.menuPlayer}>
        <Menu menuOptions={playerMenuOptions} onSelectedOption={onPlayerSelectedOption} />
      </View>
      <View style={util.mergeStyles(undefined, styles.menuActions, [{ marginLeft: 120 }, mode === 'Guest'])}>
        <Menu menuOptions={PresentationMenuOptions} onSelectedOption={onPresentationSelectedOption} />
      </View>
    </View>
    <View style={styles.endCall}>
      <Button.Kitten style={styles.endCallButton} onPress={props.onCallEnd} status="danger">
        {exitButtonText}
      </Button.Kitten>
    </View>
  </>
  );
}

export default MeetingControls;
