import React from 'react';
import clsx from 'clsx';
import Participant, { ParticipantProps } from '../Participant/Participant';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import { setCurrentPlayer } from 'utils/firebase/game';
import useSessionContext from 'hooks/useSessionContext';
import { ScreenType, UserGroup } from 'types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      overflowY: 'auto',
      background: 'rgb(79, 83, 85)',
      gridArea: '1 / 2 / 1 / 3',
      zIndex: 5,
      [theme.breakpoints.down('sm')]: {
        gridArea: '2 / 1 / 3 / 3',
        overflowY: 'initial',
        overflowX: 'auto',
        display: 'flex',
      },
    },
    transparentBackground: {
      background: 'transparent',
    },
    scrollContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    innerScrollContainer: {
      width: `calc(${theme.sidebarWidth}px - 3em)`,
      padding: '1.5em 0',
      [theme.breakpoints.down('sm')]: {
        width: 'auto',
        padding: `${theme.sidebarMobilePadding}px`,
        display: 'flex',
      },
    },
  })
);

export default function ParticipantList() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  // const mainParticipant = useMainParticipant();
  // const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;
  const { groupToken, sessionData, userGroup } = useSessionContext();

  // if (participants.length === 0) return null; // Don't render this component if there are no remote participants.

  const SmallParticipant = (props: ParticipantProps) => (
    <div className="w-40 relative">
      {userGroup === UserGroup.Moderator && props.participant.sid !== localParticipant.sid ? (
        <div className="opacity-0 hover:opacity-100 hover:bg-gray-500 bg-opacity-20 absolute top-0 left-0 w-full h-full z-30 flex items-center justify-center">
          <button
            className="text-black bg-white rounded-full p-2"
            onClick={() => {
              setCurrentPlayer(groupToken as string, props.participant.sid);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
          </button>
        </div>
      ) : null}
      <Participant {...props} />
    </div>
  );

  return (
    <div className="flex justify-center items-center w-full overflow-x-auto gap-x-5 bg-grayish my-">
      <SmallParticipant participant={localParticipant} isLocalParticipant={true} />
      {participants.map(participant => {
        return (
          <SmallParticipant
            key={participant.sid}
            participant={participant}
            isSelected={participant === selectedParticipant}
          />
        );
      })}
    </div>
  );
}
