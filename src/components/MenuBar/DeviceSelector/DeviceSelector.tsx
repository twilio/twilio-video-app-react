import React, { useState } from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import { Dialog, IconButton, DialogTitle, Divider } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { isSetSinkIdSupported } from '../../../utils';

export function DeviceSelctor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Audio Inputs</DialogTitle>
        <AudioInputList />
        <Divider />
        {isSetSinkIdSupported && (
          <>
            <DialogTitle>Audio Outputs</DialogTitle>
            <AudioOutputList />
          </>
        )}
      </Dialog>
    </>
  );
}
