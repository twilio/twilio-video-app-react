import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import PreflightTest from './PreflightTest/PreflightTest';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Video from 'twilio-video';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

interface PreJoinScreensProps {
  startUserName?: string;
  startRoomName?: string;
}

export default function PreJoinScreens({ startUserName, startRoomName }: PreJoinScreensProps) {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(startUserName || user?.displayName || '');
  const [roomName, setRoomName] = useState<string>(startRoomName || '');

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (step === Steps.deviceSelectionStep) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step]);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    // if (!window.location.origin.includes('twil.io')) {
    //  window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    //}
    setStep(Steps.deviceSelectionStep);
  };

  if (step === Steps.roomNameStep && startUserName && startRoomName) {
    handleSubmit();
  }

  const SubContent = (
    <>
      {Video.testPreflight && <PreflightTest />}
      <MediaErrorSnackbar error={mediaError} />
    </>
  );

  return (
    <IntroContainer subContent={step === Steps.deviceSelectionStep && SubContent}>
      {step === Steps.roomNameStep && (
        <RoomNameScreen
          name={name}
          roomName={roomName}
          setName={setName}
          setRoomName={setRoomName}
          handleSubmit={handleSubmit}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
