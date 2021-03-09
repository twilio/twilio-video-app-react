import React, { useState, useEffect } from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const Container = styled('div')(({ theme }) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;

  return {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
    },
  };
});

const ProcessorStats = styled('div')(({ theme }) => {
  return {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 320,
    height: 270,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingLeft: 15,
    color: 'white',
    fontSize: '16px'
  };
});

let intervalId: any;
export default function Room() {
  const [stats, setStats] = useState('');
  const { processor, room } = useVideoContext();

  useEffect(() => {
    const videoTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (!processor) {
        return;
      }
      const benchmark = processor.benchmark;
      const fps = benchmark.getRate('processFrame');

      if (!fps) {
        return;
      }

      let str = `Input FPS: ${videoTrack.mediaStreamTrack.getSettings().frameRate}\n`;
      str += `Output FPS: ${fps.toFixed(2)}\n\nAVERAGE DELAYS(ms)\n`;
      benchmark.getNames().forEach(name => {
        str += `${name}: ${benchmark.getAverageDelay(name)?.toFixed(2)}\n`;
      });

      setStats(str.trim());
    }, 1000);
  }, [stats, setStats, room, processor]);
  return (
    <Container>
      <MainParticipant />
      <ParticipantList />
      {stats && <ProcessorStats>
        <pre>{stats}</pre>
      </ProcessorStats>}
    </Container>
  );
}
