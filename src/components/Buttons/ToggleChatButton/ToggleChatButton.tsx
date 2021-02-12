import React from 'react';

import Button from '@material-ui/core/Button';
import ChatIcon from '../../../icons/ChatIcon';

import useChatContext from '../../../hooks/useChatContext/useChatContext';

export default function ToggleVideoButton() {
  const { isChatWindowOpen, setIsChatWindowOpen } = useChatContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
  };

  return (
    <Button
      onClick={toggleChatWindow}
      //   disabled={} when will this button need to be disabled?
      startIcon={<ChatIcon />}
    >
      Chat
    </Button>
  );
}
