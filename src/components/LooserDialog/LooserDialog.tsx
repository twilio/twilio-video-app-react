import React from 'react';
// import useChatContext from '../../hooks/useChatContext/useChatContext';
// import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
// import TextDialog from '../TextDialog/TextDialog';

export default function LooserDialog() {
  //   const { room, resetLooser } = useVideoContext();
  //   const [looser, setLooser] = React.useState<string>('');
  //   const onClose = () => {
  //     resetLooser()
  //     setLooser('');
  //   };
  //   React.useEffect(() => {
  //     const tracks = room?.localParticipant.dataTracks;
  //     tracks?.forEach(track => {
  //       console.log(track);
  //       if (track.kind === 'data') {
  //         track.on('message', data => {
  //           // リモートの描画を表示
  //           const d = JSON.parse(data);
  //           console.log(data);
  //         });
  //       }
  //     });
  //   }, [room, room?.localParticipant.dataTracks]);
  return <></>;
}

{
  /* <TextDialog
      open={looser.length > 0}
      onClose={onClose}
      text={`敗北者は${looser}さんでした。`}
      title="英語禁止ゲーム結果"
    /> */
}
