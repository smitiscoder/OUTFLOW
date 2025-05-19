import React, { useState } from 'react';
import { screenshots } from '../../components/lib/screenshots';
import { useSwipeable } from 'react-swipeable';

const ScreenshotsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle manual navigation (dots, swipe, or buttons)
  const goToSlide = (index) => {
    console.log('Navigating to slide:', index); // Debug index
    setActiveIndex(index);
  };

  // Swipe handlers
  const handleSwipe = (direction) => {
    const newIndex =
      direction === 'left'
        ? (activeIndex + 1) % screenshots.length
        : (activeIndex - 1 + screenshots.length) % screenshots.length;
    goToSlide(newIndex);
  };

  // Navigation button handlers
  const goToPrevious = () => {
    handleSwipe('right');
  };

  const goToNext = () => {
    handleSwipe('left');
  };

  // Configure swipeable handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true, // Allow mouse dragging for desktop
    preventDefaultTouchmoveEvent: true, // Prevent default scroll on touch
    delta: 10, // Minimum swipe distance
  });

  return (
    <section id="screenshots" className="section-padding bg-outflow-black relative py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Sneak Peek</h2>
          <div className="h-1 w-20 bg-outflow-accent mx-auto mb-6"></div>
          <p className="text-white/70 text-lg">
            See OUTFLOW in action with our intuitive and elegant user interface.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Navigation Buttons (visible on lg screens) */}
          <button
            onClick={goToPrevious}
            className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-outflow-accent/50 hover:bg-outflow-accent/70 rounded-full z-10 transition-colors"
            aria-label="Previous screenshot"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-outflow-accent/50 hover:bg-outflow-accent/70 rounded-full z-10 transition-colors"
            aria-label="Next screenshot"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel */}
          <div
            {...handlers}
            className="relative overflow-hidden"
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * (100 / screenshots.length)}%)`,
                width: `${screenshots.length * 100}%`,
              }}
            >
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot.id}
                  className="relative flex-shrink-0 w-[calc(100%/6)] max-w-[320px] h-[540px] mx-auto flex flex-col items-center"
                >
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    className="w-full h-[540px] object-contain"
                    loading="lazy"
                  />
                  <p className="mt-4 text-white text-base text-center">{screenshot.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index ? 'bg-outflow-accent w-8' : 'bg-white/30'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
