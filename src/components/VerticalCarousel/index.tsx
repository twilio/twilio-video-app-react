import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import useSessionContext from 'hooks/useSessionContext';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import { setActiveCard, setCarouselPosition, subscribeToCarouselGame } from 'utils/firebase/game';

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({ data }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedQuestion, setRevealedQuestion] = useState('');
  const [revealableIndex, setRevealableIndex] = useState<number>(-1);
  const { groupToken } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [currentPlayer, setCurrentPlayer] = useState<string>();

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);

  // Usd to determine the height/spacing of each item
  const itemHeight = 155;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex: number) => {
    // If these match, the item is active
    if (activeIndex === itemIndex) return 0;

    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(data.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
        return (data.length - (activeIndex - itemIndex)) * itemHeight;
      }
      return -(activeIndex - itemIndex) * itemHeight;
    }

    return 0;
  };

  const handleClick = () => {
    const nextCard = Math.round(Math.random() * (data.length - 1));
    setCarouselPosition(groupToken as string, nextCard);
  };

  const revealQuestion = () => {
    setRevealedQuestion(data[activeIndex].name);
  };

  const approveQuestion = () => {
    setActiveCard(groupToken as string, activeIndex);
  };

  useEffect(() => {
    subscribeToCarouselGame(groupToken as string, game => {
      const currentCard = game.carouselPosition ?? 0;
      try {
        setActiveIndex(currentCard);
        setCurrentPlayer(game.currentPlayer);
        setRevealableIndex(game.activeCard);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  useEffect(() => {
    if (data && revealableIndex >= 0 && data.length > revealableIndex && revealedQuestion === '') {
      setRevealedQuestion(data[revealableIndex].name);
    } else if (revealableIndex === -1) {
      setRevealedQuestion('');
    }
  }, [data, revealableIndex]);

  console.log(data);

  const normalInvisible = currentPlayer !== localParticipant.sid ? ' invisible' : '';

  return (
    <div className="container h-full shadow-lg mx-auto px-5 overflow-hidden">
      <section className="outer-container flex justify-between items-center h-full w-full">
        <div className={'flex flex-col'}>
          <button
            type="button"
            className={
              'shadow-lg rounded-full bg-white w-16 h-16 hover:shadow-sm transition-shadow duration-500' +
              normalInvisible
            }
            onClick={handleClick}
          >
            <img src="/assets/random-card.svg" alt="Neue Karte" />
          </button>
        </div>
        <div className="h-full relative">
          {data.map((item: any, i: number) => {
            return (
              <button
                className={cn('cursor-default z-0', 'carousel-item', {
                  active: activeIndex === i,
                  visible: Math.abs(determinePlacement(i)) <= visibleStyleThreshold,
                })}
                key={item.id}
                style={{
                  transform: `translateY(${determinePlacement(i)}px) translateX(${-150 +
                    (activeIndex === i
                      ? 0
                      : determinePlacement(i) > 0
                      ? 0.05 * determinePlacement(i)
                      : -0.05 * determinePlacement(i))}px) rotate(${
                    activeIndex === i ? 0 : -determinePlacement(i) / 30
                  }deg)`,
                }}
              >
                <div className="absolute -left-12 w-16 h-16 border-8 border-white text-white flex justify-center items-center rounded-full bg-red shadow-lg">
                  {i + 1}
                </div>
                <p>{item.category}</p>
              </button>
            );
          })}
        </div>
        <button
          className={'w-16 h-16 rounded-full turn-card-btn transform translate-x-0' + normalInvisible}
          onClick={() => revealQuestion()}
        >
          <p className="text-3xl z-40">-{`>`}</p>
        </button>
        <div className="flex justify-center items-center space-x-5">
          <div className="flex-col h-full">
            <div
              className="flex justify-center items-center text-center px-5 py-3 shadow-lg bg-red h-60 w-96 rounded-lg"
              style={{
                backgroundImage: "url('/assets/globe.svg')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: '50%',
                backgroundPosition: 'center',
              }}
            >
              <p className="text-white text-lg font-bold">{revealedQuestion}</p>
            </div>
          </div>
          <button
            className={
              'cursor-pointer w-16 h-16 flex items-center justify-center rounded-full bg-red text-white' +
              (revealedQuestion === '' ? ' invisible' : '') +
              normalInvisible
            }
            onClick={approveQuestion}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

VerticalCarousel.propTypes = {
  data: PropTypes.array.isRequired,
};

export default VerticalCarousel;
