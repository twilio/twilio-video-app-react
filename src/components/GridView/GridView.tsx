import React from 'react';
import { GRID_MODE_ASPECT_RATIO, GRID_MODE_MARGIN, GRID_MODE_MAX_PARTICIPANTS } from '../../constants';
import { makeStyles, Theme } from '@material-ui/core';
import Participant from '../Participant/Participant';
import useGridLayout from '../../hooks/useGridLayout/useGridLayout';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: 'calc(100% - 200px)',
    margin: '0 auto',
    alignContent: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gridArea: '1 / 1 / 2 / 3',
  },
  participant: {
    '&:nth-child(n + 26)': {
      display: 'none',
    },
  },
}));

export function GridView() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const participants = useParticipants();

  const { participantVideoWidth, containerRef } = useGridLayout(
    Math.min(participants.length + 1, GRID_MODE_MAX_PARTICIPANTS)
  );

  const participantWidth = `${participantVideoWidth}px`;
  const participantHeight = `${Math.floor(participantVideoWidth * GRID_MODE_ASPECT_RATIO)}px`;

  return (
    <div className={classes.container} ref={containerRef}>
      <div
        className={classes.participant}
        style={{ width: participantWidth, height: participantHeight, margin: GRID_MODE_MARGIN }}
      >
        <Participant participant={room!.localParticipant} isLocalParticipant={true} />
      </div>
      {participants.map(participant => (
        <div
          key={participant.sid}
          className={classes.participant}
          style={{ width: participantWidth, height: participantHeight, margin: GRID_MODE_MARGIN }}
        >
          <Participant participant={participant} />
        </div>
      ))}
    </div>
  );
}
