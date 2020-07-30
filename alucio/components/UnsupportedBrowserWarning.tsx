import React from 'react';
import Video from 'twilio-video';

export default function({ children }: { children: React.ReactElement }) {
  if (!Video.isSupported) {
    return (
      <div>
        Not Supported Browser
      </div>
    );
  }

  return children;
}
