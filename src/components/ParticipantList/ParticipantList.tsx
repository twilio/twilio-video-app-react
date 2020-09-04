import React from 'react';
import clsx from 'clsx';
import Participant from '../Participant/Participant';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '2em',
      overflowY: 'auto',
      background: 'rgb(79, 83, 85)',
      gridArea: '1 / 2 / 1 / 3',
      [theme.breakpoints.down('xs')]: {
        overflowY: 'initial',
        overflowX: 'auto',
        padding: 0,
        display: 'flex',
      },
    },
    transparentBackground: {
      background: 'transparent',
    },
    scrollContainer: {
      [theme.breakpoints.down('xs')]: {
        display: 'flex',
      },
    },
  })
);

export default function ParticipantList() {
  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const dominantSpeaker = useDominantSpeaker();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;

  if (participants.length === 0) return null; // Don't render this component if there are no remote participants.

  return (
    <aside
      className={clsx(classes.container, {
        [classes.transparentBackground]: !isRemoteParticipantScreenSharing,
      })}
    >
      <div className={classes.scrollContainer}>
        <Participant
          participant={localParticipant}
          isSelected={selectedParticipant === localParticipant}
          onClick={() => setSelectedParticipant(localParticipant)}
          isLocalParticipant={true}
        />
        {participants.map(participant => (
          <Participant
            key={participant.sid}
            participant={participant}
            isSelected={participant === selectedParticipant}
            isDominantSpeaker={participant === dominantSpeaker}
            onClick={() => setSelectedParticipant(participant)}
          />
        ))}
      </div>
    </aside>
  );
}
