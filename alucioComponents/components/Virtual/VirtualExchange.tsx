import React, { ReactElement, useEffect } from 'react';
import { View, Dimensions, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import { Iffy, luxColors } from '@alucio/lux-ui';
import ShareContent from './ShareContent/ShareContent';
import { Presenter, useVideoContext, useParticipants, useRoomState, MODE_TYPE } from '../../main';
import HeadBar from './MeetingControls/MeetingControls';
import Attendee from './Attendee/Attendee';
import LinearGradient from 'react-native-linear-gradient';
import useWindowSize from './Util/useWindowSize';
import { ATTENDEE_STATUS } from '@alucio/aws-beacon-amplify/src/API';
import { User } from '@alucio/aws-beacon-amplify/src/models'
import { RemoteParticipant, TwilioError, Room } from 'twilio-video';

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
    flex: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
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
    overflow: 'hidden',
  },
  headBarContainer: {
    zIndex: 1,
    flex: 1,
    flexDirection: 'row',
  },
  mainContainer: {
    backgroundColor: luxColors.virtual.background,
    height: height,
    width: width,
  },
  presentationWrapper: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 1300,
    minWidth: 900,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
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

type InitialDeviceSettings = {
  isAudioEnabled: boolean,
  isVideoEnabled: boolean,
  isPhoneAudio: boolean,
}

interface LayoutProps {
  background: ImageSourcePropType,
  currentUser?: User,
  displayContentPanel?: boolean,
  headerBackground: ImageSourcePropType,
  currentAttendees?: Record<string, any>,
  mode: MODE_TYPE,
  myContentPanel: React.ReactNode,
  onAcceptCall?: (attendeeId: string, name: string) => void,
  onDenyCall?: (attendeeId: string, name: string) => void,
  onEndCall: () => void,
  onHostConnected?: () => void,
  onAttendeeConnected?: (attendeeId: string, name: string) => void,
  onAttendeeDisconnected?: (attendeeId: string, name: string) => void,
  onRemoveFromCall?: (attendeeId: string, name: string) => void,
  showContentPanel?: () => void,
  isHostPresenting?: boolean;
  toggleHostNotes?: () => void;
  leftSide?: ReactElement;
  rightSide?: ReactElement;
  presentation?: ReactElement;
  virtual: virtualType,
  deviceSettings?: InitialDeviceSettings,
}

interface AttendersProps {
  currentAttendees: Record<string, any>;
  mode: MODE_TYPE,
  onAcceptCall?: (attendeeId: string, name: string) => void,
  onDenyCall?: (attendeeId: string, name: string) => void,
  onRemoveFromCall?: (attendeeId: string, name: string) => void,
  onAttendeeConnected?: (attendeeId: string, name: string) => void,
}

function Attenders(props: AttendersProps) {
  const { currentAttendees } = props;
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
    else if (props.mode === "Guest") {
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
        onAttendeeConnected={props.onAttendeeConnected}
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
    onAttendeeConnected,
    onAttendeeDisconnected,
    currentUser,
    onDenyCall,
    onRemoveFromCall,
    headerBackground,
    mode,
    myContentPanel,
    onHostConnected,
    currentAttendees,
    leftSide = <View/>,
    rightSide = <View/>,
    presentation,
    isHostPresenting,
    toggleHostNotes,
    virtual,
    deviceSettings,
  } = props;

  const { connect, room, isConnecting, localTracks } = useVideoContext();
  const roomState = useRoomState();
  const size = useWindowSize();
  const isHost = mode === MODE_TYPE.HOST;

  // In attendee mode the user already selected if video/audio is enabled
  useEffect(() => {
    if(deviceSettings) {
      localTracks.forEach((track:any) => {
        if(track.kind === 'video'){
          track.enable(deviceSettings.isVideoEnabled);
        } else if (track.kind === 'audio'){
          track.enable(deviceSettings.isAudioEnabled);
        }
      });
    }
  },[]);

  useEffect(() => {
    async function init() {
      if (virtual && virtual.joinToken && roomState === 'disconnected' && !isConnecting) {
        await connect(virtual.joinToken);
        if (currentUser?.id && isHost) {
          onHostConnected && onHostConnected();
        }
      }
    }

    init();
  }, [virtual])

  useEffect(()=>{
    const handleParticipantDisconnected = (e:RemoteParticipant) => {
      const attendeeId = e.identity.split('.')[0];
      onAttendeeDisconnected && onAttendeeDisconnected(attendeeId, e.identity);
    };

    const handleRoomDisconnected = (_ : Room,e:TwilioError) => {
      // When the room is finished
      handleDisconnect();
    }

    room.on('participantDisconnected', handleParticipantDisconnected);
    room.on('disconnected', handleRoomDisconnected);

    return () => {
      room
        .off('participantDisconnected', handleParticipantDisconnected)
        .off('disconnected', handleRoomDisconnected);
    };

  }, [room]);

  const handleDisconnect = () => {
    try {
      console.log('handleDisconnect')
      const videoTracks = [...room.localParticipant.videoTracks.values()];
      const audioTracks = [...room.localParticipant.audioTracks.values()];

      videoTracks.forEach(trackPub => {
        trackPub.unpublish()
        trackPub.track.stop();
        const mediaElements = trackPub.track.detach();
        mediaElements.forEach(mediaElement => mediaElement.remove());
      });
      audioTracks.forEach(trackPub => {
        trackPub.unpublish()
        trackPub.track.stop();
        const mediaElements = trackPub.track.detach();
        mediaElements.forEach(mediaElement => mediaElement.remove());
      });

    } catch (e){
      // eslint-disable-next-line no-throw-literal
      throw (`Error ending the call ${JSON.stringify(e)}`);
    }
    props.onEndCall();
  }

  const handleEndCall = () => {
    //We call disconnect which triggers the disconnect process
    room.disconnect();
  }

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
              toggleHostNotes={toggleHostNotes}
              onCallEnd={handleEndCall}
            />
          </View>
        </LinearGradient>
      </View>
      <View style={styles.contentContainer}>
        {leftSide}
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
              onAttendeeConnected={onAttendeeConnected}
            />}
          </View>
          <View style={styles.presentationWrapper}>
            <Iffy is={isHostPresenting}>
              {presentation}
            </Iffy>
            <Iffy is={!isHostPresenting}>
              <ShareContent background={background} />
            </Iffy>
          </View>
        </View>
        {rightSide}
      </View>
      {myContentPanel}
    </View>
  )
}

export default React.memo(Layout);
