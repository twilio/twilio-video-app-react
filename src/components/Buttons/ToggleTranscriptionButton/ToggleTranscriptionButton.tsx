import React from 'react';

import Button from '@material-ui/core/Button';
import VideoOnIcon from '../../../icons/VideoOnIcon';
import TranscribeDialog from '../../TranscribeDialog';

export default function ToggleTranscriptionButton(props: { disabled?: boolean; className?: string }) {
  // 文字起こしを行うかどうか
  const [isTranscription, setIsTranscription] = React.useState<boolean>(false);

  return (
    <Button className={props.className} onClick={() => setIsTranscription(true)} startIcon={<VideoOnIcon />}>
      文字起こし: {isTranscription}
      {isTranscription && <TranscribeDialog open={isTranscription} onClose={() => setIsTranscription(false)} />}
    </Button>
  );
}
