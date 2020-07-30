import React from 'react';

const Container = {
  display: 'flex',
  alignItems: 'flex-end'
};

const STEP = 3;

export default function NetworkQualityLevel({ qualityLevel }: { qualityLevel: number | null }) {
  if (qualityLevel === null) return null;
  return (
    <div style={Container}>
      {[0, 1, 2, 3, 4].map(level => (
        <div
          key={level}
          style={{
            height: `${STEP * (level + 1)}px`,
            background: qualityLevel > level ? '#0c0' : '#040',
            width: '2px',
            border: '1px solid black',
            boxSizing: 'content-box',
            borderRight: 'none'
          }
        }
        />
      ))}
    </div>
  );
}
