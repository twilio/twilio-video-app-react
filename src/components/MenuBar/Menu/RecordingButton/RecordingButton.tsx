import { MenuItem, Typography } from '@material-ui/core';
import React from 'react';
import StartRecordingIcon from '../../../../icons/StartRecordingIcon';
import StopRecordingIcon from '../../../../icons/StopRecordingIcon';
import useIsRecording from '../../../../hooks/useIsRecording/useIsRecording';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../../../state';
import { IconContainer } from '../Menu';

interface RecordingButtonProps {
  onClick(): void;
  setIsRecordingSnackbarOpen(isRecordingSnackbarOpen: boolean): void;
}

export default function RecordingButton({ onClick, setIsRecordingSnackbarOpen }: RecordingButtonProps) {
  const { isFetching, updateRecordingRules } = useAppState();
  const isRecording = useIsRecording();
  const { room } = useVideoContext();

  return (
    <MenuItem
      disabled={isFetching}
      onClick={() => {
        onClick();
        setIsRecordingSnackbarOpen(false);
        updateRecordingRules(room.sid, [{ type: isRecording ? 'exclude' : 'include', all: true }]).then(() => {
          if (isRecording) {
            setIsRecordingSnackbarOpen(true);
          }
        });
      }}
    >
      <IconContainer>{isRecording ? <StopRecordingIcon /> : <StartRecordingIcon />}</IconContainer>
      <Typography variant="body1">{isRecording ? 'Stop' : 'Start'} Recording</Typography>
    </MenuItem>
  );
}
