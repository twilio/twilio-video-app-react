import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import handleSendMessage from '../../utils/sendMessage';
// import { Conversation } from '@twilio/conversations/lib/conversation';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import { isBannedText } from '../../utils/checkText';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

interface TranscriberProps {
  onFinished?: () => void;
}
/**
 * 音声認識して、チャットに送信するコンポーネント
 * DOMとしての機能はない
 * **/
const Transcriber: React.FC<TranscriberProps> = params => {
  // 音声認識関係変数
  const speechRecogState = useSpeechRecognition();
  const { conversation } = useChatContext();
  const { room, sendLooser } = useVideoContext();
  const localParticipant = room!.localParticipant;
  // オーディオを聴けるかかどうか(これがfalseの時は音声認識しない)
  const [isAudioEnabled] = useLocalAudioToggle();

  useEffect(() => {
    // console.log(localParticipant.dataTracks)
    // console.log(room)
    const dataTracks = localParticipant.dataTracks;
    console.log(dataTracks);
    dataTracks.forEach(datat => {
      console.log('こお');
      console.log(datat);
      datat.track.on('message', data => {
        // リモートの描画を表示
        // drawLine(context, JSON.parse(data));
        console.log(data);
      });
    });

    if (isAudioEnabled) {
      if (!speechRecogState.listening) {
        // 禁止文字の場合は、looserに変数を格納し、メッセージを送ってから終了
        if (isBannedText(speechRecogState.transcript)) {
          sendLooser('test-user');
          // メッセージは送る
          handleSendMessage({
            message: speechRecogState.transcript,
            conversation: conversation,
            onFinished: speechRecogState.resetTranscript,
          });
          return params.onFinished && params.onFinished();
        }
        // メッセージを送る
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
