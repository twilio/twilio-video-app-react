import React from 'react';
import CloseIcon from '../../../icons/CloseIcon';

import useChatContext from '../../../hooks/useChatContext/useChatContext';

export default function ChatWindowHeader() {
  const { setIsChatWindowOpen } = useChatContext();

  return (
    <div className="flex w-full py-2 justify-between items-center px-2 bg-white">
      <div className="text-lg">Chat</div>
      <button className="" onClick={() => setIsChatWindowOpen(false)}>
        <CloseIcon />
      </button>
    </div>
  );
}
