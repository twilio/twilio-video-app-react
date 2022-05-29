import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import handleSendMessage from '../../utils/sendMessage';
// import { Conversation } from '@twilio/conversations/lib/conversation';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import { isBannedText } from '../../utils/checkText';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

interface TranscriberProps {
  onFinished: () => void;
}
/**
 * 音声認識して、チャットに送信するコンポーネント
 * DOMとしての機能はない
 * **/
const Transcriber: React.FC<TranscriberProps> = params => {
  // 音声認識関係変数
  const speechRecogState = useSpeechRecognition();
  const { conversation } = useChatContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  // オーディオを聴けるかかどうか(これがfalseの時は音声認識しない)
  const [isAudioEnabled] = useLocalAudioToggle();

  const onFinished = (transcription: string) => {
    // 禁止文字の場合は、looserに変数を格納し、メッセージを送ってから終了
    if (isBannedText(transcription)) {
      // メッセージを送る
      const looser = localParticipant.identity;
      handleSendMessage({
        message: `<英語禁止ゲーム終了>\n敗北者は「${looser}」さんでした。`,
        conversation: conversation,
      });
      return params.onFinished();
    }
  };

  useEffect(() => {
    if (!isAudioEnabled) return;
    if (!speechRecogState.listening && speechRecogState.transcript) {
      const transcription = speechRecogState.transcript;
      // JSONで持たせて、ゲーム中かを判定させる
      const gameText = {
        message: speechRecogState.transcript,
      };
      // メッセージを送る
      handleSendMessage({
        message: JSON.stringify(gameText),
        conversation: conversation,
        onFinished: () => onFinished(transcription),
      });
      speechRecogState.resetTranscript();
    }
    // 次の音声認識start
    SpeechRecognition.startListening();
  }, [speechRecogState.listening, isAudioEnabled]);

  return <></>;
};

export default Transcriber;
