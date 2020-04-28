import React, { useState } from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import { Dialog, IconButton, DialogTitle, Divider, DialogContent, Button } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import VideoInputList from './VideoInputList/VideoInputList';

export function DeviceSelctor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <AudioInputList />
          <AudioOutputList />
          <VideoInputList />
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
