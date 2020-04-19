import React from 'react';
import Participant from '../Participant/Participant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';

const Container = styled('aside')(({ theme }) => ({
  padding: '0.5em',
  overflowY: 'auto',
  [theme.breakpoints.down('xs')]: {
    overflowY: 'initial',
    overflowX: 'auto',
    padding: 0,
    display: 'flex',
  },
}));

const ScrollContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    display: 'flex',
  },
}));

export default function ParticipantStrip() {
  const mainParticipant = useMainSpeaker();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const screenShareParticipant = useScreenShareParticipant();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  return (
    <Container>
      <ScrollContainer>
        <Participant
          participant={localParticipant}
          isSelected={selectedParticipant === localParticipant}
          hideParticipant={false}
          disableAudio={participants.some(
            p => p.identity.split('|')[0] === localParticipant.identity.split('|')[0] + '.phone'
          )}
          //onClick={() => setSelectedParticipant(localParticipant)}
          onClick={() => ''}
        />

        {//participants.filter(p => (p !== mainParticipant || mainParticipant === screenShareParticipant) && !p.identity.split('|')[0].endsWith('.phone')).map(participant => (

        participants.map(participant => (
          <Participant
            key={participant.sid}
            participant={participant}
            isSelected={selectedParticipant === participant}
            hideParticipant={
              mainParticipant.identity === participant.identity ||
              participant.identity.split('|')[0] === localParticipant.identity.split('|')[0] + '.phone' ||
              (participant.identity.split('|')[0].endsWith('.phone') &&
                participants.some(
                  p => p.identity.split('|')[0] === participant.identity.split('|')[0].replace('.phone', '')
                ))
            }
            disableAudio={participants.some(
              p => p.identity.split('|')[0] === localParticipant.identity.split('|')[0] + '.phone'
            )}
            //onClick={() => setSelectedParticipant(participant)}
            onClick={() => ''}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
}
