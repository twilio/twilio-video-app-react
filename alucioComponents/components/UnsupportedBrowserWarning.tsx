import React from 'react';
import Video from 'twilio-video';

const useStyles = {
  container: {
    marginTop: '2.5em',
  },
  paper: {
    padding: '1em',
  },
  heading: {
    marginBottom: '0.4em',
  },
};

export default function({ children }: { children: React.ReactElement }) {
  const classes = useStyles;

  if (!Video.isSupported) {
    return (
      <div>
        Not Supported Browser
      </div>
    );
  }

  return children;
}
