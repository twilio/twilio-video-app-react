import { CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core';
import Participant from '../Participant/Participant';
import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import useGridParticipants from '../../hooks/useGridParticipants/useGridParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import { Pagination } from 'swiper';
import { Participant as IParticipant } from 'twilio-video';

const useStyles = makeStyles({
  participantContainer: {
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
    '& .swiper-slide': {
      height: '90%', // To leave room for the pagination indicators
      paddingBottom: '1em',
    },
  },
  swiperSlide: {
    display: 'flex',
    flexWrap: 'wrap',
    alignSelf: 'center',
    alignContent: 'flex-start',
  },
});

export function MobileGridView() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const participants = useGridParticipants(true);
  const dominantSpeaker = useDominantSpeaker(true);
  const remoteParticipantCount = participants.length;

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
      pages[pageNumber].push(participants[i]);
    } else {
      pages[pageNumber + 1] = [participants[i]];
    }
  }

  const participantVideoStyles: CSSProperties = {
    width: remoteParticipantCount < 3 ? '100%' : '50%',
    // The height of each participant's video is determined by the number of participants on the grid
    // page. Here the array indices represent a remoteParticipantCount. If the count is 4 or greater,
    // the height will be 33.33%
    height: ['100%', '50%', '33.33%', '50%', '33.33%'][Math.min(remoteParticipantCount, 4)],
    padding: '0.2em',
    boxSizing: 'border-box',
  };

  return (
    <div className={classes.participantContainer}>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        {pages.map((page, i) => (
          <SwiperSlide key={i} className={classes.swiperSlide}>
            {page.map(participant => (
              <div style={participantVideoStyles} key={participant.sid}>
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
