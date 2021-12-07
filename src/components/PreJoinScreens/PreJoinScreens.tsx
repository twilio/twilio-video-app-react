import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSessionContext from 'hooks/useSessionContext';
import { getUid } from 'utils/firebase/base';
import { PopupScreen } from 'components/PopupScreen';
import { LOCAL_STORAGE_KEY, UserGroup } from 'types';
import { IDENTITY_SPLITTER } from 'utils/participants';
import useChatContext from 'hooks/useChatContext/useChatContext';
import { generateIdentity } from 'utils/participants';
import { setRoomSid } from 'utils/firebase/session';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens(props: { onReady?: (name: string) => void }) {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [step, setStep] = useState(Steps.roomNameStep);
  const [mediaError, setMediaError] = useState<Error>();
  const { roomId, userGroup, groupToken, roomSid } = useSessionContext();
  const [name, setName] = useState<string>(
    user?.displayName || (localStorage.getItem(LOCAL_STORAGE_KEY.USER_NAME) ?? '')
  );
  const { getToken } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { connect: videoConnect, room } = useVideoContext();

  useEffect(() => {
    if (user?.displayName) {
      setStep(Steps.deviceSelectionStep);
    }
  }, [user]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      // window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }

    if (userGroup === UserGroup.Audience || userGroup === UserGroup.AudienceTranslated) {
      handleJoin();
    } else {
      setStep(Steps.deviceSelectionStep);
    }
  };

  const handleJoin = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY.USER_NAME, name);

    if (roomId === undefined) {
      return;
    }

    generateIdentity(name).then(identity => {
      getToken(identity, roomId).then(({ token }) => {
        if (userGroup !== UserGroup.Audience && userGroup !== UserGroup.AudienceTranslated) {
          videoConnect(token).then();
        }
        if (process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && userGroup !== UserGroup.StreamServer) {
          chatConnect(token);
        }

        props.onReady && props.onReady(name);
      });
    });
  };

  useEffect(() => {
    if (userGroup === UserGroup.StreamServer) {
      setName(UserGroup.StreamServer + IDENTITY_SPLITTER + Date.now());
    } else if (userGroup === UserGroup.StreamServerTranslated) {
      setName(UserGroup.StreamServerTranslated + IDENTITY_SPLITTER + Date.now());
    } else if (userGroup === UserGroup.Translator) {
      setName(UserGroup.Translator);
      setStep(Steps.deviceSelectionStep);
    }
  }, [userGroup]);

  useEffect(() => {
    if (room?.sid && groupToken) {
      setRoomSid(groupToken, room.sid);
    }
  }, [room?.sid, groupToken]);

  useEffect(() => {
    if (roomId === undefined || userGroup == undefined) {
      return;
    }

    if ((userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated) && roomId) {
      handleJoin();
    }
  }, [userGroup, roomId]);

  return (
    <div
      className={`w-full h-full ${
        userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated ? 'invisible' : ''
      }`}
    >
      <PopupScreen>
        <MediaErrorSnackbar error={mediaError} />
        {step === Steps.roomNameStep && <RoomNameScreen name={name} setName={setName} handleSubmit={handleSubmit} />}

        {step === Steps.deviceSelectionStep && (
          <DeviceSelectionScreen handleJoin={handleJoin} setStep={setStep} name={name} />
        )}
      </PopupScreen>
    </div>
  );
}
