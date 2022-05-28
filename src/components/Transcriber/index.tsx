import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import handleSendMessage from '../../utils/sendMessage';
// import { Conversation } from '@twilio/conversations/lib/conversation';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';

interface TranscriberProps {}
/**
 * 音声認識して、チャットに送信するコンポーネント
 * DOMとしての機能はない
 * **/
const Transcriber: React.FC<TranscriberProps> = params => {
  // 音声認識関係変数
  const speechRecogState = useSpeechRecognition();
  const { conversation } = useChatContext();
  // オーディオを聴けるかかどうか(これがfalseの時は音声認識しない)
  const [isAudioEnabled] = useLocalAudioToggle();

  useEffect(() => {
    if (isAudioEnabled) {
      if (!speechRecogState.listening) {
        handleSendMessage({
          message: speechRecogState.transcript,
          conversation: conversation,
          onFinished: speechRecogState.resetTranscript,
        });
      }
      // 次の音声認識start
      SpeechRecognition.startListening();
    }
  }, [speechRecogState.listening, isAudioEnabled]);

  return <></>;
};

export default Transcriber;
