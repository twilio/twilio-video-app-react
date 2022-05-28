import React from 'react';

import Button from '@material-ui/core/Button';
import TranscriptionOnIcon from '../../../icons/StartEnglishGame';
import TranscriptionOffIcon from '../../../icons/EndEnglishGame';
import Transcriber from '../../Transcriber';
// import useChatContext from '../../../hooks/useChatContext/useChatContext';

export interface ToggleTranscriptionButtonProps {
  disabled?: boolean;
  className?: string;
}

export default function ToggleTranscriptionButton(props: ToggleTranscriptionButtonProps) {
  // const { conversation } = useChatContext();
  // 文字起こしを行うかどうか
  const [isTranscription, setIsTranscription] = React.useState<boolean>(false);
  return (
    <Button
      className={props.className}
      onClick={() => setIsTranscription(!isTranscription)}
      startIcon={isTranscription ? <TranscriptionOffIcon /> : <TranscriptionOnIcon />}
    >
      英語禁止ゲーム{isTranscription ? '終了' : '開始'}
      {isTranscription && <Transcriber />}
    </Button>
  );
}
