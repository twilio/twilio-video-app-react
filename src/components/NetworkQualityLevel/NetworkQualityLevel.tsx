import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Participant } from 'twilio-video';
import { useAppState } from '../../state';
import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outerContainer: {
      width: '2em',
      height: '2em',
      padding: '0.9em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      '& div': {
        width: '2px',
        marginRight: '1px',
        '&:not(:last-child)': {
          borderRight: 'none',
        },
      },
    },
    mobileGridView: {
      [theme.breakpoints.down('sm')]: {
        width: '1.5em',
        height: '1.5em',
      },
    },
  })
);

const STEP = 3;
const BARS_ARRAY = [0, 1, 2, 3, 4];

export default function NetworkQualityLevel({ participant }: { participant: Participant }) {
  const classes = useStyles();
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const { isGridModeActive } = useAppState();

  if (networkQualityLevel === null) return null;

  return (
    <div className={clsx(classes.outerContainer, { [classes.mobileGridView]: isGridModeActive })}>
      <div className={classes.innerContainer}>
        {BARS_ARRAY.map(level => (
          <div
            key={level}
            style={{
              height: `${STEP * (level + 1)}px`,
              background: networkQualityLevel > level ? 'white' : 'rgba(255, 255, 255, 0.2)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
