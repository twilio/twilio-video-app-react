import React, { ReactElement, useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import { Iffy, luxColors, useInterval } from '@alucio/lux-ui';
import ShareContent from './ShareContent/ShareContent';
import { Presenter, useVideoContext, useParticipants, useRoomState, MODE_TYPE } from '../../main';
import HeadBar from './MeetingControls/MeetingControls';
import Attendee from './Attendee/Attendee';
import LinearGradient from 'react-native-linear-gradient';
import useWindowSize from './Util/useWindowSize';
import { ATTENDEE_STATUS } from '@alucio/aws-beacon-amplify/src/API';
import { User } from '@alucio/aws-beacon-amplify/src/models'
import { RemoteParticipant, Room } from 'twilio-video';
import { subSeconds, isAfter, compareAsc } from 'date-fns'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const MAX_ATTENDEES = 5;

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
    zIndex: -1, // Needed for popover
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
  audioFiles?: any[],
  deviceSettings?: InitialDeviceSettings,
}

interface AttendeesProps {
  currentAttendees: Record<string, any>;
  mode: MODE_TYPE,
  onAcceptCall?: (attendeeId: string, name: string) => void,
  onDenyCall?: (attendeeId: string, name: string) => void,
  onRemoveFromCall?: (attendeeId: string, name: string) => void,
  onAttendeeConnected?: (attendeeId: string, name: string) => void,
}
interface AttendeeRecord {
  id: string,
  identity: string,
  status: ATTENDEE_STATUS,
  name: string,
  lastSeenAt?: string,
  createdAt?: string,
}
function Attendees(props: AttendeesProps) {
  const { currentAttendees } = props;
  const participants = useParticipants();
  const [disconnectedAttendees, setDisconnectedAttendees] = useState<AttendeeRecord[]>([]);

  // In Guest Mode all attendee information is derived from participants
  const connectedAttendees = participants.map( (participant):AttendeeRecord => {
    return {
      id: participant.identity.split('.')[0],
      identity: participant.identity,
      status: ATTENDEE_STATUS.CONNECTED,
      name: participant.identity.split('.').slice(2).join('.'),
    }
  });

  const allPendingAttendees = Object.keys(currentAttendees).map( (identity):AttendeeRecord => {
    return {
      identity: identity,
      ...currentAttendees[identity],
    }
  }).filter( (attendee) => attendee.status === ATTENDEE_STATUS.PENDING || attendee.status === ATTENDEE_STATUS.ACCEPTED );
  const getConnectedDisconnectedAttendees = (attendee : AttendeeRecord[]) : AttendeeRecord[][] => {
    const last7Seconds = subSeconds(new Date(), 7);
    return attendee.reduce<AttendeeRecord[][]>( (acc, attendee) => {
      if (attendee.lastSeenAt && isAfter(new Date(attendee.lastSeenAt), last7Seconds)) {
        acc[0].push(attendee);
      } else {
        acc[1].push(attendee);
      }
      return acc;
    }, [[], []] as AttendeeRecord[][])
  };

  const [connectedPendingAttendees, disconnectedPendingAttendees] = getConnectedDisconnectedAttendees(allPendingAttendees);
  useEffect( () => setDisconnectedAttendees(disconnectedPendingAttendees), [] )
  const allAttendees = [...connectedAttendees, ...connectedPendingAttendees];
  allAttendees.sort( (a, b) => {
    if (a.id === 'host') {
      return -1;
    } else if (b.id === 'host') {
      return 1;
    } else if (a.status === ATTENDEE_STATUS.PENDING && b.status === ATTENDEE_STATUS.PENDING) {
      return compareAsc(new Date(a?.createdAt ?? '1900-01-01'), new Date(b?.createdAt ?? '1900-01-01'));
    } else if (a.status === ATTENDEE_STATUS.PENDING) {
      return -1;
    } else if (b.status === ATTENDEE_STATUS.PENDING) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Check on regular intervals to see if any attendees lastChangedAt has exceeded timeout window
  useInterval(() => {
    const disconnectedPendingAttendees = getConnectedDisconnectedAttendees(allPendingAttendees)[1];
    const currAttendeeSet = new Set(disconnectedPendingAttendees.map((x) => x.id));
    if ( currAttendeeSet.size !== disconnectedAttendees.length ||
      !disconnectedAttendees.reduce( (allPresent:boolean, attendee:AttendeeRecord) : boolean => allPresent && currAttendeeSet.has(attendee.id), true )) {
      // Setting state causes a re-render
      setDisconnectedAttendees(disconnectedPendingAttendees);
    }
  }, 2000);

  const connectedOrAccepted = allAttendees.filter((x) => x.status === ATTENDEE_STATUS.ACCEPTED || x.status === ATTENDEE_STATUS.CONNECTED)

  const handleCallAccepted = (attendeeId: string, name: string) => {
    if ( connectedOrAccepted.length >= MAX_ATTENDEES ) {
      // TODO: Temporary Solution Pending Design
      // eslint-disable-next-line no-alert
      alert(`You have reached the limit of ${MAX_ATTENDEES}.`);
    } else {
      props.onAcceptCall && props.onAcceptCall(attendeeId, name);
    }
  }
  const attendeeControls = allAttendees.map((e) =>
    <Attendee
      key={`accept_deny_${e.identity}`}
      status={e.status}
      attendeeId={e.id}
      showHostControls={props.mode === 'Host'}
      name={e.identity}
      onAcceptCall={handleCallAccepted}
      onDenyCall={props.onDenyCall}
      onRemoveFromCall={props.onRemoveFromCall}
      onAttendeeConnected={props.onAttendeeConnected}
    />,
  )

  return (<>{attendeeControls}</>)
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
    audioFiles,
    deviceSettings,
  } = props;

  const { connect, room, isConnecting, localTracks } = useVideoContext();
  const roomState = useRoomState();
  const size = useWindowSize();
  const isHost = mode === MODE_TYPE.HOST;

  // [TODO] - Check
  // In attendee mode the user already selected if video/audio is enabled
  useEffect(() => {
    if (deviceSettings) {
      localTracks.forEach((track:any) => {
        if (track.kind === 'video') {
          track.enable(deviceSettings.isVideoEnabled);
        } else if (track.kind === 'audio') {
          track.enable(deviceSettings.isAudioEnabled);
        }
      });
    }
  }, []);

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

  useEffect(() => {
    const handleParticipantDisconnected = (e:RemoteParticipant) => {
      const attendeeId = e.identity.split('.')[0];
      onAttendeeDisconnected && onAttendeeDisconnected(attendeeId, e.identity);
    };

    const handleRoomDisconnected = (_: Room) => {
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
    } catch (e) {
      throw new Error(`Error ending the call ${JSON.stringify(e)}`);
    }
    props.onEndCall();
  }

  const handleEndCall = () => {
    // We call disconnect which triggers the disconnect process
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
              audioFiles={audioFiles}
              isConnected={roomState === 'connected'}
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
            <Attendees
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
