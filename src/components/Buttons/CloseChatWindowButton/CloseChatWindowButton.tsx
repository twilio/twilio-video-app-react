import React from 'react';
import CloseChatWindowIcon from '../../../icons/CloseChatWindowIcon';
import useChatContext from '../../../hooks/useChatContext/useChatContext';

export default function CloseChatWindowButton() {
  const { setIsChatWindowOpen } = useChatContext();

  const closeChatWindow = () => {
    setIsChatWindowOpen(false);
  };

  return (
    <div onClick={closeChatWindow}>
      <CloseChatWindowIcon />
    </div>
  );
}
