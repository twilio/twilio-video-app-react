import React, { useState } from 'react';

import ChatIcon from '@material-ui/icons/CommentOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useSnackbar } from 'notistack';
import ChatInput from './ChatInput';
import { Button, ClickAwayListener, Theme, withStyles } from '@material-ui/core';

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: 'white',
  },
  arrow: {
    color: 'white',
  },
}))(Tooltip);

export default function ChatSnackButton() {
  const { room } = useVideoContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = (message: string) => {
    const [dataTrackPublication] = [...room.localParticipant.dataTracks.values()];

    const fullMessage = `${room.localParticipant.identity} says: ${message}`;

    dataTrackPublication.track.send(fullMessage);
    enqueueSnackbar(fullMessage); // So the local participant can see that their message was sent.
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <LightTooltip title={<ChatInput onSend={handleSend} />} interactive placement="top" arrow={true} open={isOpen}>
        <Button onClick={() => setIsOpen(isOpen => !isOpen)} startIcon={<ChatIcon />}>
          Chat
        </Button>
      </LightTooltip>
    </ClickAwayListener>
  );
}
