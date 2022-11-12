import React from 'react';
import MaskSelectionHeader from './MaskSelectionHeader/MaskSelectionHeader';
import MaskThumbnail from './MaskThumbnail/MaskThumbnail';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { maskConfig } from '../VideoProvider/useMaskSettings/useMaskSettings';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    display: 'flex',
    width: theme.rightDrawerWidth,
    height: `calc(100% - ${theme.footerHeight}px)`,
  },
  thumbnailContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '5px',
    overflowY: 'auto',
  },
}));

function MaskSelectionDialog() {
  const classes = useStyles();
  const { isMaskSelectionOpen, setIsMaskSelectionOpen } = useVideoContext();

  const imageNames = maskConfig.imageNames;
  const images = maskConfig.images;

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isMaskSelectionOpen}
      transitionDuration={0}
      classes={{
        paper: classes.drawer,
      }}
    >
      <MaskSelectionHeader onClose={() => setIsMaskSelectionOpen(false)} />
      <div className={classes.thumbnailContainer}>
        <MaskThumbnail thumbnail={'none'} name={'None'} />
        {images.map((image, index) => (
          <MaskThumbnail thumbnail={'image'} name={imageNames[index]} index={index} imagePath={image} key={image} />
        ))}
      </div>
    </Drawer>
  );
}

export default MaskSelectionDialog;
