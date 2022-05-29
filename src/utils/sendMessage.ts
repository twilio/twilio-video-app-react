import { Conversation } from '@twilio/conversations/lib/conversation';
// import useChatContext from '../hooks/useChatContext/useChatContext';

/** メッセージを送信する関数 **/
export default function handleSendMessage(p: {
  message: string;
  onFinished?: () => void;
  conversation: Conversation | null;
}) {
  // チャット
  if (!p.conversation) {
    return;
  }
  if (isValidMessage(p.message)) {
    // 処理の順番を守る
    p.conversation.sendMessage(p.message.trim()).then(() => {
      if (p.onFinished) {
        p.onFinished();
      }
    });
  }
}

export const isValidMessage = (message: string) => {
  return /\S/.test(message);
};
