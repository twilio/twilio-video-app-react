import { makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import useGridLayout from '../../hooks/useGridLayout/useGridLayout';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Participant from '../Participant/Participant';

const MAX_PARTICIPANTS = 25;
const ASPECT_RATIO = 9 / 16; // 16:9

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'absolute',
    display: 'flex',
    alignContent: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    top: '3px',
    right: '5em',
    bottom: '3px',
    left: '5em',
  },
  participant: {
    '&:nth-child(n + 27)': {
      display: 'none',
    },
  },
}));

export function GridView() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const participants = useParticipants();

  const { participantVideoWidth, containerRef } = useGridLayout(
    Math.min(participants.length + 1, MAX_PARTICIPANTS),
    false
  );

  const participantWidth = `${participantVideoWidth}px`;
  const participantHeight = `${Math.floor(participantVideoWidth * ASPECT_RATIO)}px`;

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.participant} style={{ width: participantWidth, height: participantHeight, margin: 3 }}>
        <Participant participant={room!.localParticipant} />
      </div>
      {participants.map(participant => (
        <div className={classes.participant} style={{ width: participantWidth, height: participantHeight, margin: 3 }}>
          <Participant key={participant.sid} participant={participant} />
        </div>
      ))}
    </div>
  );
}
