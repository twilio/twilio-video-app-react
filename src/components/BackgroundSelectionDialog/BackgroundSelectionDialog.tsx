import React from 'react';
import BackgroundSelectionHeader from './BackgroundSelectionHeader/BackgroundSelectionHeader';
import BackgroundThumbnail from './BackgroundThumbnail/BackgroundThumbnail';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { backgroundConfig } from '../VideoProvider/useBackgroundSettings/useBackgroundSettings';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

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

  const imageNames = backgroundConfig.imageNames;
  const images = backgroundConfig.images;

  const groupedImages = [];
  // puts images into groups of 2, for easier mapping
  // assumes that there an odd number of available images
  for (var i = 1; i < images.length; i += 2) {
    let group = [];
    group.push(
      {
        imageName: imageNames[i],
        image: images[i],
        index: i,
      },
      {
        imageName: imageNames[i + 1],
        image: images[i + 1],
        index: i + 1,
      }
    );
    groupedImages.push(group);
  }

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
        <BackgroundThumbnail thumbnail={'none'} name={'None'} />
        <BackgroundThumbnail thumbnail={'blur'} name={'Blur'} />
      </div>

      <div className={classes.thumbnailRow}>
        <BackgroundThumbnail thumbnail={'grayScale'} name={'Gray Scale'} />
        <BackgroundThumbnail thumbnail={'image'} name={imageNames[0]} imagePath={images[0]} index={0} />
      </div>

      {groupedImages.map(row => (
        <div className={classes.thumbnailRow}>
          <BackgroundThumbnail
            thumbnail={'image'}
            name={row[0].imageName}
            index={row[0].index}
            imagePath={row[0].image}
          />
          <BackgroundThumbnail
            thumbnail={'image'}
            name={row[1].imageName}
            index={row[1].index}
            imagePath={row[1].image}
          />
        </div>
      ))}
    </Drawer>
  );
}

export default BackgroundSelectionDialog;
