import React, { useState } from 'react';
import ChatIcon from '@material-ui/icons/CommentOutlined';
import ChatInput from './ChatInput';
import { Button, ClickAwayListener, Tooltip, withStyles } from '@material-ui/core';

const LightTooltip = withStyles({
  tooltip: {
    backgroundColor: '#fafafa',
  },
  arrow: {
    color: '#fafafa',
  },
})(Tooltip);

export default function ChatSnackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <LightTooltip title={<ChatInput />} interactive placement="top" arrow={true} open={isOpen}>
        <Button onClick={() => setIsOpen(isOpen => !isOpen)} startIcon={<ChatIcon />}>
          Snack Chat
        </Button>
      </LightTooltip>
    </ClickAwayListener>
  );
}
