import React from 'react';
import clsx from 'clsx';
import BlurIcon from '@material-ui/icons/BlurOnOutlined';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import NoneIcon from '@material-ui/icons/NotInterestedOutlined';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export type Thumbnail = 'none' | 'blur' | 'image';

interface BackgroundThumbnailProps {
  thumbnail: Thumbnail;
  imagePath?: string;
  name?: string;
  index?: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumbContainer: {
      margin: '10px 0px 10px 10px',
      width: '144px',
      height: '80px',
      display: 'flex',
    },
    thumbIconContainer: {
      width: '144px',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      border: 'solid #A9A9A9',
      '&.selected': {
        border: 'solid #027AC5',
        '& svg': {
          color: '#027AC5',
        },
      },
    },
    thumbIcon: {
      height: 50,
      width: 50,
      color: '#A9A9A9',
      '&.selected': {
        color: '#027AC5',
      },
    },
    thumbImage: {
      width: '100%',
      borderRadius: '10px',
      border: 'solid #A9A9A9',
      '&:hover': {
        cursor: 'pointer',
        '& svg': {
          color: '#027AC5',
        },
        '& $thumbOverlay': {
          visibility: 'visible',
        },
      },
      '&.selected': {
        border: 'solid #027AC5',
        '& svg': {
          color: '#027AC5',
        },
      },
    },
    thumbOverlay: {
      position: 'absolute',
      color: 'transparent',
      padding: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '144px',
      height: '80px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        background: 'rgba(95, 93, 128, 0.6)',
        color: 'white',
      },
    },
  })
);

export default function BackgroundThumbnail({ thumbnail, imagePath, name, index }: BackgroundThumbnailProps) {
  const classes = useStyles();
  const { backgroundSettings, setBackgroundSettings } = useVideoContext();
  const isImage = thumbnail === 'image';
  const thumbnailSelected = isImage
    ? backgroundSettings.index === index && backgroundSettings.type === 'image'
    : backgroundSettings.type === thumbnail;
  const icons = {
    none: NoneIcon,
    blur: BlurIcon,
    image: null,
  };
  const ThumbnailIcon = icons[thumbnail];

  return (
    <div
      className={classes.thumbContainer}
      onClick={() =>
        setBackgroundSettings({
          type: thumbnail,
          index: index,
        })
      }
    >
      {ThumbnailIcon ? (
        <div className={clsx(classes.thumbIconContainer, { selected: thumbnailSelected })}>
          <ThumbnailIcon className={classes.thumbIcon} />
        </div>
      ) : (
        <img className={clsx(classes.thumbImage, { selected: thumbnailSelected })} src={imagePath} alt={name} />
      )}
      <div className={classes.thumbOverlay}>{name}</div>
    </div>
  );
}
