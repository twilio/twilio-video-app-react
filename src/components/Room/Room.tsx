import React from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

export default function Room() {
  return (
    <Container>
      <ParticipantStrip />
    </Container>
  );
}
