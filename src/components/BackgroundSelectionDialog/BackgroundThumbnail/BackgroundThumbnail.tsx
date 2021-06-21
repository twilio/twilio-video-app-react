import React, { useState } from 'react';
import BlurIcon from '@material-ui/icons/BlurOnOutlined';
import GrayIcon from '@material-ui/icons/GradientOutlined';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import NoneIcon from '@material-ui/icons/NotInterestedOutlined';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { BackgroundSettings } from '../../VideoProvider/useBackgroundSettings/useBackgroundSettings';

export type Thumbnail = 'none' | 'blur' | 'grayScale' | 'image';

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
      border: '2px solid rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
      ['&:hover']: {
        cursor: 'pointer',
        boxShadow: 'inset 0 0 0 100px rgb(95, 93, 128, 0.6)',
        ['& svg']: {
          color: '#027AC5',
        },
      },
      ['&:last-child']: {
        marginRight: '10px',
      },
      [theme.breakpoints.down('sm')]: {
        height: '50px',
      },
      ['&.selected']: {
        border: '3px solid #027AC5',
        ['& svg']: {
          color: '#027AC5',
        },
      },
    },
    label: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px',
      position: 'absolute',
    },
    thumbIcon: {
      height: 50,
      width: 50,
      color: 'rgba(0, 0, 0, 0.5)',
      ['&.selected']: {
        color: '#027AC5',
      },
    },
  })
);

export default function BackgroundThumbnail({ thumbnail, imagePath, name, index }: BackgroundThumbnailProps) {
  const classes = useStyles();
  const [hovering, setHovering] = useState(false);
  const { backgroundSettings, setBackgroundSettings } = useVideoContext();

  if (thumbnail === 'image') {
    const thumbnailSelected = backgroundSettings.type === 'image' && backgroundSettings.index === index;
    return (
      <div
        className={classes.thumb + (thumbnailSelected ? ' selected' : '')}
        style={{
          backgroundImage: `url('${imagePath}')`,
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => {
          setBackgroundSettings({
            type: 'image',
            index: index,
          } as BackgroundSettings);
        }}
      >
        {hovering && <div className={classes.label}>{name}</div>}
      </div>
    );
  } else {
    const getIcon = () => {
      if (thumbnail === 'none') {
        return <NoneIcon className={classes.thumbIcon} />;
      } else if (thumbnail === 'blur') {
        return <BlurIcon className={classes.thumbIcon} />;
      } else {
        return <GrayIcon className={classes.thumbIcon} />;
      }
    };
    return (
      <div
        className={classes.thumb + (backgroundSettings.type === thumbnail ? ' selected' : '')}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => {
          setBackgroundSettings({
            type: thumbnail,
            index: 0,
          } as BackgroundSettings);
        }}
      >
        {getIcon()}
        {hovering && <div className={classes.label}>{name}</div>}
      </div>
    );
  }
}
