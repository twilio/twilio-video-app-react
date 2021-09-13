import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import ErrorDialog from '../ErrorDialog/ErrorDialog';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName, URLParticipantName, URLFrom }: any = useParams();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  const [mediaError, setMediaError] = useState<Error>();
  const [validationError, setValidationError] = useState<Error | null>(null);

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }
    }
    if (URLParticipantName) {
      setName(URLParticipantName);
    }
    if (URLFrom) {
      sessionStorage.setItem('URLFrom', URLFrom);
    } else {
      sessionStorage.removeItem('URLFrom');
    }
    if (URLRoomName && URLParticipantName) {
      if (window.history && window.history.pushState) {
        window.history.pushState(
          {},
          'Rewrite URL',
          `${window.location.protocol}//${window.location.host}/room/${URLRoomName}`
        );
      }
      setStep(Steps.deviceSelectionStep);
    }
  }, [user, URLRoomName, URLParticipantName, URLFrom]);

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

    if (roomName.length > 100) {
      setValidationError(new Error('O código do atendimento é inválido'));
      return;
    }

    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setStep(Steps.deviceSelectionStep);
  };

  return (
    <IntroContainer>
      <ErrorDialog dismissError={() => setValidationError(null)} error={validationError} />
      <MediaErrorSnackbar error={mediaError} />
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
