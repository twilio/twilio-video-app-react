import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import LocalAudioLevelIndicator from '../../../LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../../../VideoTrack/VideoTrack';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    paddingTop: `${(9 / 16) * 100}%`,
    background: 'black',
  },
  innerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  identityContainer: {
    position: 'absolute',
    bottom: 0,
  },
  identity: {
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '0.18em 0.3em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
});

export default function LocalVideoPreview({ identity }: { identity: string }) {
  const classes = useStyles();
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>{videoTrack ? <VideoTrack track={videoTrack} isLocal /> : null}</div>

      <div className={classes.identityContainer}>
        <span className={classes.identity}>
          <LocalAudioLevelIndicator />
          <Typography variant="body1" color="inherit" component="span">
            {identity}
          </Typography>
        </span>
      </div>
    </div>
  );
}
