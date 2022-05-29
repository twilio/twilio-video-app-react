import React from 'react';

import Button from '@material-ui/core/Button';
import TranscriptionOnIcon from '../../../icons/StartEnglishGame';
import TranscriptionOffIcon from '../../../icons/EndEnglishGame';
import handleSendMessage from '../../../utils/sendMessage';
import useChatContext from '../../../hooks/useChatContext/useChatContext';

export interface ToggleGameButtonProps {
  disabled?: boolean;
  className?: string;
}

export default function ToggleGameButton(props: ToggleGameButtonProps) {
  const { conversation } = useChatContext();
  // 文字起こしを行うかどうか
  const [game, setGame] = React.useState<boolean>(false);
  const onClick = () => {
    let newgame = !game;
    if (newgame) {
      handleSendMessage({
        message: '<英語禁止ゲーム開始>',
        conversation: conversation,
      });
    }
    setGame(newgame);
  };
  return (
    <Button
      className={props.className}
      onClick={onClick}
      startIcon={game ? <TranscriptionOffIcon /> : <TranscriptionOnIcon />}
    >
      英語禁止ゲーム{game ? '終了' : '開始'}
    </Button>
  );
}
