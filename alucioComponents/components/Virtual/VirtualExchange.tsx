import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import { luxColors } from '@alucio/lux-ui';
import ShareContent from './ShareContent/ShareContent';
import { Presenter, useVideoContext, useParticipants, useRoomState, MODE_TYPE } from '../../main';
import HeadBar from './MeetingControls/MeetingControls';
import Attendee from './Attendee/Attendee';
import LinearGradient from 'react-native-linear-gradient';
import useWindowSize from './Util/useWindowSize';
import { ATTENDEE_STATUS } from '@alucio/aws-beacon-amplify/src/API';
import { User } from '@alucio/aws-beacon-amplify/src/models'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'absolute',
    zIndex: 0,
  },
  container: {
    flexGrow: 1,
    backgroundColor: luxColors.basicBlack.primary,
  },
  imageBackground: {
    display: 'flex',
    width: 300,
    opacity: 0.2,
    alignSelf: 'flex-end',
    height: '100%',
  },
  header: {
    height: 80,
    flexDirection: 'row',
  },
  headBarContainer: {
    zIndex: 1,
    flex: 1,
    flexDirection: 'row',
  },
  mainContainer: {
    width: width,
    height: height,
  },
  sideBarStyle: {
    flexDirection: 'row',
    width: '100%',
  },
})

export type virtualType = {
  joinToken: string,
  session: {
    id: string
  }
}

interface LayoutProps {
  background: ImageSourcePropType,
  currentUser?: User,
  displayContentPanel?: boolean,
  headerBackground: ImageSourcePropType,
  currentAttendees?: Record<string,any>,
  mode: MODE_TYPE,
  myContentPanel: React.ReactNode,
  onAcceptCall?: (attendeeId:string, name:string) => void,
  onDenyCall?: (attendeeId:string, name:string) => void,
  onEndCall: (id:string) => void,
  onHostConnected?: () => void,
  onUserConnected?: (attendeeId:string, name:string) => void,
  onRemoveFromCall?: (attendeeId:string, name:string) => void,
  showContentPanel?: () => void,
  virtual: virtualType,
}

interface AttendersProps {
  currentAttendees: Record<string,any>;
  mode: MODE_TYPE,
  onAcceptCall?: (attendeeId:string, name:string) => void,
  onDenyCall?: (attendeeId:string, name:string) => void,
  onRemoveFromCall?: (attendeeId:string, name:string) => void,
  onUserConnected?: (attendeeId:string, name:string) => void,
}

function Attenders(props: AttendersProps) {
  const {currentAttendees} = props;
  const attenders = useParticipants();

  const attendersInTheMeeting = attenders.reduce((p, c) => {
    if (props.mode === "Host" && 
      currentAttendees[c.identity] &&
      currentAttendees[c.identity].status === ATTENDEE_STATUS.CONNECTED
    ) {
      // @ts-ignore
      p[c.identity] = {
        id: c.identity.split('.')[0],
        name: c.identity,
        status: ATTENDEE_STATUS.CONNECTED,
      };
    }
    else if(props.mode === "Guest"){
      // @ts-ignore
      p[c.identity] = {
        id: c.identity.split('.')[0],
        name: c.identity,
        status: ATTENDEE_STATUS.CONNECTED,
      }
    }
    return p;
  }, {});

  // TODO: Revisit this
  // When a user is connected the host goes to disconected, when he goes back the users on
  // connected status arent in the store so we are loading that from the twilio api
  const attendees = Object.assign({ ...currentAttendees }, { ...attendersInTheMeeting });
  const participants = Object.keys(attendees)
    .filter(e => (attendees[e].status === ATTENDEE_STATUS.PENDING || attendees[e].status === ATTENDEE_STATUS.CONNECTED || attendees[e].status === ATTENDEE_STATUS.ACCEPTED))
    .map((e) =>
      <Attendee
        key={`accept_deny_${e}`}
        status={attendees[e].status}
        attendeeId={attendees[e]?.id}
        visible={props.mode === "Host"}
        name={e}
        onAcceptCall={props.onAcceptCall}
        onDenyCall={props.onDenyCall}
        onRemoveFromCall={props.onRemoveFromCall}
        onUserConnected={props.onUserConnected}
      />,
    )

  return (<>{participants}</>)
}

function Layout(props: LayoutProps) {
  const {
    onAcceptCall, 
    background, 
    displayContentPanel,
    showContentPanel,
    onUserConnected, 
    currentUser, 
    onDenyCall, 
    onRemoveFromCall,
    headerBackground, 
    mode, 
    myContentPanel,
    onHostConnected,
    currentAttendees, 
    virtual, 
  } = props;

  const { connect } = useVideoContext();
  const roomState = useRoomState();
  const size = useWindowSize();

  
  useEffect(() => {
    async function init() {
      if (virtual && virtual.joinToken && roomState === 'disconnected') {
          await connect(virtual.joinToken);
          if (currentUser?.id && mode === 'Host') {
            onHostConnected && onHostConnected();
          }
      }
    }
    init();
  }, [virtual])
  return (
    <View style={[styles.mainContainer, { width: size.width, height: size.height }]}>
      <View style={styles.header}>
        <LinearGradient
          colors={[luxColors.alucioPurple.secondary, luxColors.alucioPurple.tertiary]}
          style={styles.sideBarStyle}
        >
          <View style={styles.backgroundImageContainer}>
            <ImageBackground
              imageStyle={{ resizeMode: 'cover' }}
              source={headerBackground}
              style={styles.imageBackground}
            />
          </View>
          <View style={styles.headBarContainer}>
            <HeadBar 
              virtual={virtual}
              mode={mode}
              displayContentPanel={displayContentPanel || false} 
              onShowContentPanel={showContentPanel} 
              onCallEnd={props.onEndCall} 
            />
          </View>
        </LinearGradient>
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <Presenter />
          {roomState === 'connected' && 
          <Attenders 
            mode={mode} 
            currentAttendees={currentAttendees || {}} 
            onAcceptCall={onAcceptCall} 
            onDenyCall={onDenyCall}
            onRemoveFromCall={onRemoveFromCall}
            onUserConnected={onUserConnected} 
          />}
        </View>
        <ShareContent background={background} />
      </View>
        {myContentPanel}
    </View>
  )
}

export default React.memo(Layout);
