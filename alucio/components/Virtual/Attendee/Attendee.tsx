import React, { useState } from 'react';
import { Button, luxColors, Icon } from '@alucio/lux-ui';
import { View, StyleSheet, Text } from 'react-native';
import { MenuItem, OverflowMenu } from '@ui-kitten/components';
import { ATTENDEE_STATUS } from '@alucio/aws-beacon-amplify/src/API';
import { useParticipants, Participant } from '../../../main';

const styles = StyleSheet.create({
  accept: {
    backgroundColor: luxColors.success.primary,
    borderRadius: 30,
  },
  acceptDenyContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
  },
  button: {
    height: 20,
    borderWidth: 0,
    width: 110,
  },
  deny: {
    backgroundColor: luxColors.error.primary,
    marginLeft: 10,
    borderRadius: 30,
  },
  mainContainer: {
    width: 256,
    height: 144,
    marginTop: 10,
    marginLeft: 10,
    borderColor: luxColors.success.primary,
    backgroundColor: luxColors.contentPanelBackground.primary,
    borderWidth: 5,
  },
  name: {
    color: luxColors.info.primary,
    margin: 5,
    opacity: 0.8,
  },
  nameContainer: {
    backgroundColor: luxColors.opacityBackground.primary,
  },
  participant: {
    alignSelf: 'center',
    width: 256,
    height: 144,
    marginTop: 10,
    marginLeft: '1em',
  },
  rightMenu: {
    alignSelf: 'flex-end',
    zIndex: 100,
  },
  rightMenuButton: {
    backgroundColor: 'black',
  },
  rightMenuButtonIcon: {
    color: 'white',
  },
})

interface AttendeeProps {
  onAcceptCall?: (attendeeId: string, name: string) => void,
  onDenyCall?: (attendeeId: string, name: string) => void,
  onRemoveFromCall?: (attendeeId: string, name: string) => void,
  onAttendeeConnected?: (attendeeId: string, name: string) => void,
  name: string,
  attendeeId: string,
  status: ATTENDEE_STATUS,
  visible : boolean
}

interface RightMenuProps {
  onRemoveFromCall?: () => void,
}

function connected(props:AttendeeProps) {
  if (props.visible) {
    props.onAttendeeConnected && props.onAttendeeConnected(props.attendeeId, props.name);
  }
}

function RightMenu(props:RightMenuProps) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(visible => !visible);
  }

  const anchor = (<View style={styles.rightMenu}>
    <Button.Kitten
      size="tiny"
      style={styles.rightMenuButton}
      onPress={toggleVisibility}
      appearance="ghost"
    >
      {/* TODO:  the accessoryLeft didnt work  */}
      <Icon
        style={styles.rightMenuButtonIcon}
        name={'dots-vertical'}
      />
    </Button.Kitten>
  </View>)
  return (
    <OverflowMenu anchor={() => anchor} visible={visible} onBackdropPress={() => setVisible(false)} >
      <MenuItem title={'Remove'} onPress={props.onRemoveFromCall} />
    </OverflowMenu>
  )
}

function Attendee(props: AttendeeProps) {
  const participants = useParticipants();

  const readyToShowVideo = participants.find(e => e.identity === props.name);
  // Change the user status when enters to the room, only when the user have benn in the room for 10 seconds
  // this is because the first time the user is trying to connect the event of disconnect it is fired couple of times
  readyToShowVideo && connected(props);

  const acceptDenyContainer = (props.status === ATTENDEE_STATUS.PENDING
    ? <>
      <Button.Kitten
        onPress={onAccept}
        style={[styles.button, styles.accept]}>
        Admit
      </Button.Kitten>
      <Button.Kitten
        onPress={onDeny}
        style={[styles.button, styles.deny]}>
        Remove
      </Button.Kitten>
    </>
    : <>
      <Text style={styles.name}>Connecting...</Text>
    </>)

  function onAccept() {
    if (props.visible) {
      props.onAcceptCall && props.onAcceptCall(props.attendeeId, props.name);
    }
  }

  function onDeny() {
    if (props.visible) {
      props.onDenyCall && props.onDenyCall(props.attendeeId, props.name);
    }
  }

  function onRemoveFromCall() {
    if (props.visible) {
      props.onRemoveFromCall && props.onRemoveFromCall(props.attendeeId, props.name);
    }
  }

  function getName(name: string) {
    if (name.split('.').length > 1) {
      return name.split('.')[2];
    }
    return name;
  }

  return (
    readyToShowVideo
      ? <View style={styles.participant}>
        <Participant
          key={readyToShowVideo.sid}
          participant={readyToShowVideo}
          menu={props.visible ? <RightMenu onRemoveFromCall={onRemoveFromCall} /> : null}
          isSelected={false}
          onClick={() => { }}
        />
      </View>
      : <View style={styles.mainContainer}>
        {props.status === ATTENDEE_STATUS.CONNECTED && <RightMenu onRemoveFromCall={onRemoveFromCall} />}
        <View style={styles.acceptDenyContainer}>
          {acceptDenyContainer}
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {`${getName(props.name)}`}
          </Text>
        </View>
      </View>
  )
}

export default React.memo(Attendee);
