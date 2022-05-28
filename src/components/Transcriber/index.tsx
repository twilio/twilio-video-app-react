import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import handleSendMessage from '../../utils/sendMessage';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import { Conversation } from '@twilio/conversations/lib/conversation';

interface TranscriberProps {
  conversation?: Conversation | null;
}
/**
 * 音声認識して、チャットに送信するコンポーネント
 * DOMとしての機能はない
 * **/
const Transcriber: React.FC<TranscriberProps> = params => {
  // 音声認識関係変数
  const speechRecogState = useSpeechRecognition();
  // conversationがparamsにないときは、useChatContext()から取得する。
  const conv = params.conversation === undefined ? useChatContext().conversation : params.conversation;
  useEffect(() => {
    if (!speechRecogState.listening) {
      console.log(speechRecogState);
      handleSendMessage({
        message: speechRecogState.transcript,
        conversation: conv,
        onFinished: speechRecogState.resetTranscript,
      });
    }
    // 次の音声認識start
    SpeechRecognition.startListening();
  }, [speechRecogState.listening]);

  return <></>;
};

export default Transcriber;
