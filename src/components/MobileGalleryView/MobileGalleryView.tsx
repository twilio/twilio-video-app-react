import { CSSProperties } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme, useMediaQuery } from '@material-ui/core';
import Participant from '../Participant/Participant';
import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import useParticipantContext from '../../hooks/useParticipantsContext/useParticipantsContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import { Participant as IParticipant } from 'twilio-video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    participantContainer: {
      background: theme.galleryViewBackgroundColor,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      height: '100%',
      '& .swiper': {
        height: '100%',
        '--swiper-pagination-bullet-inactive-color': 'white',
      },
      '& .swiper-wrapper': {
        height: '100%',
      },
      '& .swiper-pagination.swiper-pagination-bullets': {
        bottom: '5px',
      },
    },
    isPaginationActive: {
      '& .swiper-slide': {
        // To leave room for the pagination indicators:
        height: 'calc(100% - 21px)',
        paddingBottom: '21px',
      },
    },
    swiperSlide: {
      display: 'flex',
      flexWrap: 'wrap',
      alignSelf: 'center',
      alignContent: 'flex-start',
    },
  })
);

export function MobileGalleryView() {
  const classes = useStyles();
  const isMobileLandscape = useMediaQuery('screen and (orientation: landscape)');
  const { room } = useVideoContext();
  const { mobileGalleryViewParticipants } = useParticipantContext();
  const dominantSpeaker = useDominantSpeaker(true);
  const remoteParticipantCount = mobileGalleryViewParticipants.length;

  const pages: IParticipant[][] = [[]];
  // Add the localParticipant to the front of the array to ensure they are always the first participant:
  pages[0].push(room!.localParticipant);

  for (let i = 0; i < remoteParticipantCount; i++) {
    const pageNumber = Math.floor(i / 6);
    if (!pages[pageNumber]) {
      pages[pageNumber] = [];
    }
    // Each page should have a max of 6 participants:
    if (pages[pageNumber].length < 6) {
      pages[pageNumber].push(mobileGalleryViewParticipants[i]);
    } else {
      pages[pageNumber + 1] = [mobileGalleryViewParticipants[i]];
    }
  }

  const portraitParticipantVideoStyles: CSSProperties = {
    width: remoteParticipantCount < 3 ? '100%' : '50%',
    // The height of each participant's video is determined by the number of participants on the gallery view
    // page. Here the array indices represent a remoteParticipantCount. If the count is 4 or greater,
    // the height will be 33.33%
    height: ['100%', '50%', '33.33%', '50%', '33.33%'][Math.min(remoteParticipantCount, 4)],
    padding: '0.2em',
    boxSizing: 'border-box',
  };

  const landscapeParticipantVideoStyles: CSSProperties = {
    height: remoteParticipantCount < 3 ? '100%' : '50%',
    width: ['100%', '50%', '33.33%', '50%', '33.33%'][Math.min(remoteParticipantCount, 4)],
    padding: '0.2em 0.1em',
    boxSizing: 'border-box',
  };

  return (
    <div className={clsx(classes.participantContainer, { [classes.isPaginationActive]: remoteParticipantCount > 5 })}>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        {pages.map((page, i) => (
          <SwiperSlide key={i} className={classes.swiperSlide}>
            {page.map(participant => (
              <div
                data-test-id="participantContainer"
                style={isMobileLandscape ? landscapeParticipantVideoStyles : portraitParticipantVideoStyles}
                key={participant.sid}
              >
                <Participant
                  participant={participant}
                  isLocalParticipant={room!.localParticipant === participant}
                  isDominantSpeaker={dominantSpeaker === participant}
                />
              </div>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
