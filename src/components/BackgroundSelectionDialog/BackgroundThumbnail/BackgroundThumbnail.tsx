import React from 'react';
import clsx from 'clsx';
import BlurIcon from '@material-ui/icons/BlurOnOutlined';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import NoneIcon from '@material-ui/icons/NotInterestedOutlined';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { Box } from '@material-ui/core';

export type Thumbnail = 'none' | 'blur' | 'image';

interface BackgroundThumbnailProps {
  thumbnail: Thumbnail;
  imagePath?: string;
  name?: string;
  index?: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumb: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0px 10px 10px',
      width: '45%',
      height: '80px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      border: '3px solid rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
      '&:hover': {
        cursor: 'pointer',
        boxShadow: 'inset 0 0 0 100px rgb(95, 93, 128, 0.6)',
        '& svg': {
          color: '#027AC5',
        },
        '& $label': {
          visibility: 'visible',
        },
      },
      '&:last-child': {
        marginRight: '10px',
      },
      [theme.breakpoints.down('sm')]: {
        height: '50px',
      },
      '&.selected': {
        border: '3px solid #027AC5',
        '& svg': {
          color: '#027AC5',
        },
      },
    },
    label: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px',
      position: 'absolute',
      visibility: 'hidden',
    },
    thumbIcon: {
      height: 50,
      width: 50,
      color: 'rgba(0, 0, 0, 0.5)',
      '&.selected': {
        color: '#027AC5',
      },
    },
  })
);

export default function BackgroundThumbnail({ thumbnail, imagePath, name, index }: BackgroundThumbnailProps) {
  const classes = useStyles();
  const { backgroundSettings, setBackgroundSettings } = useVideoContext();
  const isImage = thumbnail === 'image';
  const thumbnailSelected = isImage ? backgroundSettings.index === index : backgroundSettings.type === thumbnail;
  const icons = {
    none: NoneIcon,
    blur: BlurIcon,
    image: Box,
  };
  const ThumbnailIcon = icons[thumbnail];

  return (
    <div
      className={clsx(classes.thumb, { selected: thumbnailSelected })}
      style={{
        backgroundImage: isImage ? `url('${imagePath}')` : '',
      }}
      onClick={() => {
        setBackgroundSettings({
          type: thumbnail,
          index: index,
        });
      }}
    >
      <ThumbnailIcon className={classes.thumbIcon} />
      <div className={classes.label}>{name}</div>
    </div>
  );
}
