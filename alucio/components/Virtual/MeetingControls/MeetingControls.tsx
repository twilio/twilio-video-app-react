import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Stack, luxColors, util } from '@alucio/lux-ui';
import Menu, { MenuOption } from '../Menu/Menu';
import { useLocalAudioToggle, useLocalVideoToggle, useVideoContext, MODE_TYPE } from '../../../main';
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
  nameText: {
    color: luxColors.info.primary,
    opacity: 0.6,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    minWidth: 74,
    paddingLeft: 16,
  },
  logoContainer: {
    flex: 1,
    height: '100%',
    minWidth: 140,
    maxWidth: 140,
    paddingRight: 40,
    overflow: 'hidden',
  },
  logo: {
    opacity: 0.1,
    backgroundColor: luxColors.thumbnailBorder.primary,
    width: 210,
    height: 200,
    top: -30,
    left: -40,
    transform: [{ rotate: '-24deg' }],
  },
})

const PlayerMenuOptions: MenuOption[] = [
  {
    title: 'Mute',
    icon: 'microphone',
  },
  {
    title: 'Stop Video',
    icon: 'video',
  },
  {
    title: 'Settings',
    icon:  'settings',
  },
];

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
    title: 'News',
    icon: 'note-text',
  },
];

interface HeadBarProps {
  mode: MODE_TYPE,
  displayContentPanel: boolean,
  onCallEnd: () => void,
  onShowContentPanel?: () => void,
  virtual: virtualType,
  audioFiles?: any[],
}

function toggleIcon(selected: MenuOption, tooltipText: string[], icon: string[]) {
  const item = PlayerMenuOptions.find((e) => (e.title === selected.title)) as MenuOption;
  item.title = item.title === tooltipText[0] ? tooltipText[1] : tooltipText[0];
  item.icon = item.icon === icon[0] ? icon[1] : icon[0];
}

function MeetingControls(props: HeadBarProps) {
  const { mode, audioFiles } = props;
  PresentationMenuOptions[0].active = props.displayContentPanel;
  const { room } = useVideoContext();
  const [, toggleAudioEnabled] = useLocalAudioToggle();
  const [, toggleVideoEnabled] = useLocalVideoToggle();
  const exitButtonText = mode === 'Host' ? 'End' : 'Leave';

  if (mode === 'Guest') {
    // For the guest remove some options
    PresentationMenuOptions = PresentationMenuOptions.filter((e) => {
      return !(['My Content', 'News'].includes(e.title));
    })
  }

  useEffect(() => {
    room.once('disconnected', (_, c) => {
      // When the room is finished
      if (c && c.code && c.code === 53118) {
        props.onCallEnd();
      }
    });
  }, [room])

  function onPlayerSelectedOption(selected: MenuOption) {
    if (selected.title === 'Mute' || selected.title === 'Unmute') {
      toggleIcon(selected, ['Mute', 'Unmute'], ['microphone', 'microphone-off']);
      toggleAudioEnabled();
    }
    else if (selected.title === 'Stop Video' || selected.title === 'Start Video') {
      toggleIcon(selected, ['Stop Video', 'Start Video'], ['video', 'video-off']);
      toggleVideoEnabled();
    }
  }

  function onPresentationSelectedOption(selected: MenuOption): void {
    if (selected.title === 'My Content') {
      props.onShowContentPanel && props.onShowContentPanel();
    }
  }

  async function endCall() {
    props.onCallEnd();
  }

  return (<>
    <View style={styles.logoContainer}>
      <Stack anchor="center" alignSelf="center">
        <Stack.Layer>
          <View style={styles.logo}/>
        </Stack.Layer>
        <Stack.Layer>
          <Text style={styles.nameText}>Virtual Exchange</Text>
        </Stack.Layer>
      </Stack>
    </View>
    <View style={styles.menu}>
      <View style={styles.menuPlayer}>
        <Menu
          menuOptions={PlayerMenuOptions}
          onSelectedOption={onPlayerSelectedOption}
          audioFiles={audioFiles}
        />
      </View>
      <View style={util.mergeStyles(undefined, styles.menuActions, [{ marginLeft: 120 }, mode === 'Guest'])}>
        <Menu
          menuOptions={PresentationMenuOptions}
          onSelectedOption={onPresentationSelectedOption}
        />
      </View>
    </View>
    <View style={styles.endCall}>
      <Button.Kitten style={styles.endCallButton} onPress={endCall} status="danger">
        {exitButtonText}
      </Button.Kitten>
    </View>
  </>
  );
}

export default MeetingControls;
