import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import useSessionContext from 'hooks/useSessionContext';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import { setActiveCard, setCarouselPosition, subscribeToCarouselGame } from 'utils/firebase/game';
import useGameContext from 'hooks/useGameContext';
import { RevealedCard } from 'components/RevealedCard';

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({ data }: any) => {
  const [activeIndex, setActiveIndex] = useState<number>();
  const { revealedCard, setRevealedCard } = useGameContext();
  const [revealableIndex, setRevealableIndex] = useState<number>();
  const { groupToken } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [currentPlayer, setCurrentPlayer] = useState<string>();
  const [initialized, setInitialized] = useState(false);
  const [seed, setSeed] = useState<number>();

  const screenWidth = window.screen.width;

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);

  // Usd to determine the height/spacing of each item
  let itemHeight = screenWidth > 1536 ? 150 : 100;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex: number) => {
    if (!activeIndex) {
      return 0;
    }
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
    if (activeIndex) {
      setRevealedCard(data[activeIndex].name);
    }
  };

  const approveQuestion = () => {
    if (activeIndex) {
      setActiveCard(groupToken as string, activeIndex);
    }
  };

  const spinTo = (newPos: number) => {
    if (!activeIndex) {
      return;
    }

    const diff = newPos - activeIndex;
    const dir = diff >= 0;
    const steps = diff;

    console.log({ diff, dir, steps, newPos, activeIndex });

    let last = activeIndex;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        let next = last;
        if (dir) {
          next += 1;
          if (next >= data.length) {
            next = 0;
          }
        } else {
          next -= 1;
          if (next < 0) {
            next = data.length - 1;
          }
        }
        last = next;
        setActiveIndex(next);
      }, i * i + i * 2);
    }

    setTimeout(() => {
      setActiveIndex(newPos);
    }, steps * steps + steps * 2);
  };

  useEffect(() => {
    subscribeToCarouselGame(groupToken as string, game => {
      const currentCard = game.carouselPosition ?? 0;
      try {
        if (!initialized) {
          setActiveIndex(currentCard);
          setInitialized(true);
        }
        if (seed !== game.seed) {
          spinTo(currentCard);
          setSeed(game.seed);
        }
        setCurrentPlayer(game.currentPlayer);
        setRevealableIndex(game.activeCard);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  useEffect(() => {
    if (revealableIndex && data && revealableIndex >= 0 && data.length > revealableIndex) {
      setRevealedCard(data[revealableIndex].name);
    } else if (revealableIndex === -1) {
      setRevealedCard('');
    }
  }, [data, revealableIndex]);

  const normalInvisible = currentPlayer !== localParticipant.sid ? ' invisible' : '';

  return (
    <div className="container h-full shadow-lg mx-auto px-2 lg:px-5 overflow-hidden">
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
        <div className="h-full relative px-20 transform -translate-x-20">
          {data.map((item: any, i: number) => {
            const pos = determinePlacement(i);
            const visible = Math.abs(pos) <= visibleStyleThreshold;

            let tx, ty;
            if (visible) {
              tx = activeIndex === i ? 0 : (Math.sqrt(Math.abs(pos) * 0.11) * 0.05 * pos * pos) / Math.abs(pos);
              ty = pos;
            } else {
              const edgePos = (visibleStyleThreshold * Math.abs(pos)) / pos;
              ty = edgePos;
              tx = (Math.sqrt(Math.abs(edgePos) * 0.11) * 0.05 * edgePos * edgePos) / Math.abs(edgePos);
            }

            return (
              <button
                className={cn('cursor-default z-0 relative', 'carousel-item', {
                  active: activeIndex === i,
                  visible,
                })}
                key={i}
                style={{
                  transform: `translateY(${pos}px) translateX(${tx}px) rotate(${activeIndex === i ? 0 : -pos / 12}deg)`,
                  zIndex: -1 * Math.abs(pos / itemHeight) + data.length,
                }}
              >
                <div className="absolute -left-12 2xl:-left-8 top-0 bottom-0 flex items-center">
                  <div className="w-16 h-16 border-4 text-3xl shadow-xl border-white text-white flex justify-center items-center rounded-full bg-purple">
                    {i + 1}
                  </div>
                </div>

                <p>{item.category}</p>
              </button>
            );
          })}
        </div>
        <button
          className={
            'w-16 h-16 rounded-full bg-purple text-white transform translate-x-0 shadow-xl hover:shadow-none transition-shadow duration-500' +
            normalInvisible
          }
          onClick={() => revealQuestion()}
        >
          <p className="text-3xl z-40">-{`>`}</p>
        </button>
        <div className="flex justify-center items-center space-x-5">
          <div className="flex-col h-full">
            <div className="w-56 h-32 lg:h-60 lg:w-96">
              <RevealedCard />
            </div>
          </div>
          <button
            className={
              'cursor-pointer w-16 h-16 flex items-center justify-center rounded-full bg-purple text-white' +
              (revealedCard === '' ? ' invisible' : '') +
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
