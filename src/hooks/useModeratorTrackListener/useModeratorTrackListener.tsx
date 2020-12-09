import useVideoContext from '../useVideoContext/useVideoContext';
import { useEffect } from 'react';
import { RemoteParticipant, Track } from 'twilio-video';
import { ParticipantIdentity } from '../../utils/participantIdentity';
import { TRACK_TYPE } from 'utils/displayStrings';
import isModerator from 'utils/rbac/roleChecker';
import { IMuteRemoteParticipantMessage } from '../../utils/muteRemoteParticipantMessage';

export default function useModeratorTrackListener() {
  const { room, localTracks } = useVideoContext();

  useEffect(() => {
    const handleRemoteParticipant = (participant: RemoteParticipant) => {
      if (isModerator(ParticipantIdentity.Parse(participant.identity).partyType)) {
        participant.on('trackSubscribed', track => {
          console.log(`Participant "${participant.identity}" added ${track.kind} Track ${track.sid}`);
          if (track.kind === 'data') {
            track.on('message', data => {
              console.log('message recieved ' + data);
              handleMessage(data);
            });
          }
        });
      }
    };

    function handleMessage(data: any) {
      console.log(`received message on mute moderator data track: ${data}`);

      var muteRemoteParticipantMessage = JSON.parse(data) as IMuteRemoteParticipantMessage;
      if (muteRemoteParticipantMessage.participantSid === room.localParticipant.sid) {
        console.log(
          `Received mute participant message for this participant (${room.localParticipant.sid}). Disabling/Muting local audio track`
        );
        const audioTrack = localTracks.find(x => x.kind === TRACK_TYPE.AUDIO);
        audioTrack?.disable();
      }
    }

    //for existing participants at time when this local participant joins
    if (room !== undefined && room.participants !== undefined) {
      room.participants.forEach(handleRemoteParticipant);
    }

    //for participants who join after this local participant joins
    room.on('participantConnected', handleRemoteParticipant);
    return () => {
      room.off('participantConnected', handleRemoteParticipant);
    };
  }, [room, localTracks]);
}
