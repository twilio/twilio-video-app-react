import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from '../DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../../IntroContainer/IntroContainer';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function QuestionScreens({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  console.log('QuestionScreens');
  const [isAnswerd, setAnswerd] = useState(false);

  const handleQuestion = () => {
    setAnswerd(true);
    console.log('unko deta');
  };

  if (!isAnswerd) {
    return (
      <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }}>
            ウンチing now...
          </Typography>
          <Button variant="contained" color="primary" onClick={handleQuestion} disabled={false}>
            ウンチ　done
          </Button>
        </div>
      </Grid>
    );
  }

  return <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />;
}
