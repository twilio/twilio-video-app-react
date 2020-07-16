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
  displayContentPanel: boolean;
  onCallEnd: (id:string) => void;
  onShowContentPanel?: () => void;
  virtual: virtualType;
}

function toggleIcon(selected: MenuOption, tooltipText: string[], icon: string[]) {
  const item = PlayerMenuOptions.find((e) => (e.title === selected.title)) as MenuOption;
  item.title = item.title === tooltipText[0] ? tooltipText[1] : tooltipText[0];
  item.icon = item.icon === icon[0] ? icon[1] : icon[0];
}

function MeetingControls(props: HeadBarProps) {
  const { virtual, mode } = props;
  PresentationMenuOptions[0].active = props.displayContentPanel;
  const roomState = useRoomState();
  const { room } = useVideoContext();
  const [, toggleAudioEnabled] = useLocalAudioToggle();
  const [, toggleVideoEnabled] = useLocalVideoToggle();
  const exitButtonText = mode === 'Host' ? 'End' : 'Leave';

  if(mode === 'Guest'){
    // For the guest remove some options
    PresentationMenuOptions = PresentationMenuOptions.filter((e)=> {
      return !(['My Content', 'News'].includes(e.title));
    })
  }

  useEffect(()=>{
    room.once('disconnected', (_, c) => {
      // When the room is finished
      if(c && c.code && c.code === 53118){
        props.onCallEnd(virtual?.session?.id);
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
    try {
      props.onCallEnd(virtual?.session?.id);
      if (roomState === 'connected') {
        room.disconnect && room.disconnect();
      }
    }
    catch (ex) {
      // eslint-disable-next-line no-throw-literal
      throw (`Error ending the call ${JSON.stringify(ex)}`)
    }
  }

  return (<>
    <View style={styles.name}>
      <Text style={styles.nameText}>
          Virtual Exchange
      </Text>
      <View style={styles.logo}/>
    </View>
    <View style={styles.menu}>
      <View style={styles.menuPlayer}>
        <Menu menuOptions={PlayerMenuOptions} onSelectedOption={onPlayerSelectedOption} />
      </View>
      <View style={util.mergeStyles(undefined, styles.menuActions, [{marginLeft: 120}, mode === 'Guest'])}>
        <Menu menuOptions={PresentationMenuOptions} onSelectedOption={onPresentationSelectedOption} />
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
