import React from 'react';
import { styled } from '@material-ui/core/styles';
import useMos from '../../hooks/useMos/useMos';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  '& div': {
    width: '2px',
    marginRight: '1px',
    '&:not(:last-child)': {
      borderRight: 'none',
    },
  },
});

const STEP = 3;
const BARS_ARRAY = [0, 1, 2, 3, 4];

export default function MosLevel() {
  const mosLevel = useMos();
  if (mosLevel === null) return null;
  return (
    <Container>
      {BARS_ARRAY.map(level => (
        <div
          key={level}
          style={{
            height: `${STEP * (level + 1)}px`,
            background: mosLevel > level ? 'white' : 'rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
    </Container>
  );
}
