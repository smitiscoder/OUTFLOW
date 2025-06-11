import React, { useEffect, useState, useRef } from 'react';
import { testimonials } from '../../components/lib/testimonials';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../components/ui/carousel';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      setIsVisible(true);
    }
  }, [isInView, controls]);

  // Floating animation variants
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Background particles animation
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const handleCarouselChange = (index) => {
    setActiveIndex(index);
  };

  return (
    <section id="reviews" className="section-padding bg-outflow-darkgray relative py-24 overflow-hidden" ref={ref}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-outflow-accent/10"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-outflow-darkgray/50 via-outflow-darkgray to-outflow-darkgray/50 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
              }
            }
          }}
        >
          <motion.div
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="inline-block"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-outflow-accent to-white">
              What Our Users Say
            </h2>
          </motion.div>
          <motion.div 
            className="h-1 w-20 bg-gradient-to-r from-outflow-accent/50 via-outflow-accent to-outflow-accent/50 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          />
          <motion.p 
            className="text-white/70 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Join thousands of satisfied users who've transformed their financial habits with OUTFLOW.
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="w-full"
        >
          <Carousel 
            className="w-full max-w-5xl mx-auto focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onSelect={handleCarouselChange}
          >
            <CarouselContent>
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <motion.div 
                      variants={itemVariants}
                      initial="hidden"
                      animate={isVisible ? "visible" : "hidden"}
                      exit="exit"
                      className="glass-card p-6 h-full transition-all duration-500 hover:shadow-outflow-accent/20 hover:shadow-2xl mx-2 relative group focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {/* Glowing effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-outflow-accent/0 via-outflow-accent/5 to-outflow-accent/0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg"></div>

                      {/* Rating stars with animation */}
                      <motion.div 
                        className="mb-4 flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                          >
                            <Star
                              size={18}
                              className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} transition-transform duration-300 group-hover:scale-110`}
                            />
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Quote icon with animation */}
                      <motion.div 
                        className="absolute top-6 right-6 text-white/10"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        <Quote size={32} className="transform -rotate-180" />
                      </motion.div>

                      {/* Testimonial content with staggered animation */}
                      <motion.p 
                        className="text-white/80 italic mb-6 text-lg relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {testimonial.content}
                      </motion.p>
                      
                      {/* User info with slide-up animation */}
                      <motion.div 
                        className="mt-auto pt-4 border-t border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="text-lg font-bold text-white group-hover:text-outflow-accent transition-colors duration-300">
                          {testimonial.name}
                        </h4>
                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                      </motion.div>

                      {/* Active indicator */}
                      {activeIndex === index && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-outflow-accent/50 via-outflow-accent to-outflow-accent/50"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </CarouselItem>
                ))}
              </AnimatePresence>
            </CarouselContent>

            {/* Enhanced navigation buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <CarouselPrevious className="relative bg-outflow-accent/20 border-outflow-accent/30 text-white hover:bg-outflow-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-outflow-accent/20 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <CarouselNext className="relative bg-outflow-accent/20 border-outflow-accent/30 text-white hover:bg-outflow-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-outflow-accent/20 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
              </motion.div>
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
