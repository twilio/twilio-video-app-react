import React from 'react';
import BackgroundSelectionHeader from './BackgroundSelectionHeader/BackgroundSelectionHeader';
import BackgroundThumbnail from './BackgroundThumbnail/BackgroundThumbnail';
import { Thumbnail } from './BackgroundThumbnail/BackgroundThumbnail';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { strict } from 'assert';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    display: 'flex',
    width: theme.rightDrawerWidth,
    height: `calc(100% - ${theme.footerHeight}px)`,
  },
  thumbnailRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}));

function BackgroundSelectionDialog() {
  const classes = useStyles();
  const { isBackgroundSelectionOpen, setIsBackgroundSelectionOpen } = useVideoContext();

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isBackgroundSelectionOpen}
      transitionDuration={0}
      classes={{
        paper: classes.drawer,
      }}
    >
      <BackgroundSelectionHeader onClose={() => setIsBackgroundSelectionOpen(false)} />

      <div className={classes.thumbnailRow}>
        <BackgroundThumbnail thumbnail={'none'} name={'none'} />
        <BackgroundThumbnail thumbnail={'blur'} name={'blur'} />
      </div>

      <div className={classes.thumbnailRow}>
        <BackgroundThumbnail thumbnail={'grayScale'} name={'gray scale'} />
        <BackgroundThumbnail thumbnail={'image'} name={'the cow'} index={0} />
      </div>

      {arr.map(val => (
        <div className={classes.thumbnailRow}>
          <BackgroundThumbnail thumbnail={'image'} name={'cow1' + String(val)} index={2 * val} />
          <BackgroundThumbnail thumbnail={'image'} name={'cow2' + String(val)} index={2 * val + 1} />
        </div>
      ))}
      {
        // TODO Implement background selection logic and front end
      }
    </Drawer>
  );
}

export default BackgroundSelectionDialog;
