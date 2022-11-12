import React from 'react';
import MaskSelectionHeader from './MaskSelectionHeader/MaskSelectionHeader';
// import BackgroundThumbnail from './BackgroundThumbnail/BackgroundThumbnail';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme } from '@material-ui/core/styles';
// import { backgroundConfig } from '../VideoProvider/useBackgroundSettings/useBackgroundSettings';
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

  //   const imageNames = backgroundConfig.imageNames;
  //   const images = backgroundConfig.images;

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
      {/* <div className={classes.thumbnailContainer}>
        <BackgroundThumbnail thumbnail={'none'} name={'None'} />
        <BackgroundThumbnail thumbnail={'blur'} name={'Blur'} />
        {images.map((image, index) => (
          <BackgroundThumbnail
            thumbnail={'image'}
            name={imageNames[index]}
            index={index}
            imagePath={image}
            key={image}
          />
        ))}
      </div> */}
    </Drawer>
  );
}

export default MaskSelectionDialog;
