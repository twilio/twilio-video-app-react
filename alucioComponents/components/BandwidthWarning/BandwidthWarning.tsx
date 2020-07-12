import React from 'react';

//import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const BandwidthWarningContainerStyle = {
  position: 'absolute',
  zIndex: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const Warning = {
  textAlign: 'center',
  margin: '0.6em 0',
};

export default function BandwidthWarning() {
  return (
    <div>
      <div>
        {/* <ErrorOutlineIcon fontSize="large" /> */}
      </div>
      <div>Insufficient Bandwidth</div>
    </div>
  );
}
