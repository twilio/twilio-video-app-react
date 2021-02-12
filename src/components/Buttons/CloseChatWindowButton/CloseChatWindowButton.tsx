import React from 'react';
import Button from '@material-ui/core/Button';
import CloseChatWindowIcon from '../../../icons/CloseChatWindowIcon';
import useChatContext from '../../../hooks/useChatContext/useChatContext';

export default function CloseChatWindowButton() {
  const { setIsChatWindowOpen } = useChatContext();

  const closeChatWindow = () => {
    setIsChatWindowOpen(false);
  };

  return (
    <Button onClick={closeChatWindow}>
      <CloseChatWindowIcon />
    </Button>
  );
}
