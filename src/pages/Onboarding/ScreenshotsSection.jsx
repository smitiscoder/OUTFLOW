import React, { useState } from 'react';
import { screenshots } from '../../components/lib/screenshots';
import { Dialog, DialogContent } from "../../components/ui/dialog";

const ScreenshotsSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [openScreenshot, setOpenScreenshot] = useState(null);

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

        <div className="overflow-x-auto pb-8 no-scrollbar">
          <div className="flex gap-8 min-w-max px-4 md:px-0">
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.id}
                className="relative flex-shrink-0 w-[280px] md:w-[320px] h-[540px] overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer glass-card"
                style={{
                  transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  zIndex: activeIndex === index ? 10 : 1
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setOpenScreenshot(index)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-outflow-black/70"></div>
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl transition-all duration-700"
                  style={{
                    filter: activeIndex === index ? 'brightness(1)' : 'brightness(0.8)',
                    transform: `scale(${activeIndex === index ? 1.05 : 1})`
                  }}
                />
                <div className="absolute top-4 left-4 right-4 flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-white mr-1.5"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-white/50 mr-1.5"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-white/30"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <p className="text-base text-white font-medium">{screenshot.alt}</p>
                  <p className="text-sm text-white/60 mt-1">Tap to expand</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index ? 'bg-outflow-accent w-8' : 'bg-white/30'
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Modal for expanded screenshots */}
      <Dialog open={openScreenshot !== null} onOpenChange={() => setOpenScreenshot(null)}>
        <DialogContent className="max-w-4xl bg-outflow-black border border-white/10">
          {openScreenshot !== null && (
            <div className="p-2">
              <img
                src={screenshots[openScreenshot].src}
                alt={screenshots[openScreenshot].alt}
                className="w-full rounded-lg shadow-2xl"
              />
              <p className="mt-4 text-center text-lg">{screenshots[openScreenshot].alt}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ScreenshotsSection;
