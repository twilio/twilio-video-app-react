import React from 'react';
import { Participant } from 'twilio-video';
import useParticipantIsReconnecting from '../../../../src/hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';

const useStyles = {
  indicator: {
    width: '10px',
    height: '10px',
    borderRadius: '100%',
    background: '#0c0',
    display: 'inline-block',
    marginRight: '3px',
  },
  isReconnecting: {
    background: '#ffb100',
  },
};

export default function ParticipantConnectionIndicator({ participant }: { participant: Participant }) {
  const isReconnecting = useParticipantIsReconnecting(participant);
  const classes = useStyles;
  return (
    <div title={isReconnecting ? 'Participant is reconnecting' : 'Participant is connected'}>
      <span
        // @ts-ignore
        styles={classes.indicator} />
    </div>
  );
}
