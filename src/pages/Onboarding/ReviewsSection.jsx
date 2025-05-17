import React from 'react';
import { testimonials } from '../../components/lib/testimonials';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../components/ui/carousel';

const ReviewsSection = () => {
  return (
    <section id="reviews" className="section-padding bg-outflow-darkgray relative py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
          <div className="h-1 w-20 bg-outflow-accent mx-auto mb-6"></div>
          <p className="text-white/70 text-lg">
            Join thousands of satisfied users who've transformed their financial habits with OUTFLOW.
          </p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div 
                  className="glass-card p-6 h-full transition-all duration-300 hover:shadow-outflow-accent/10 hover:shadow-xl mx-2"
                  data-aos="fade-up"
                >
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-white/20'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-white/80 italic mb-6 text-lg">"{testimonial.content}"</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <h4 className="text-lg font-bold">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="mr-2 bg-outflow-accent/20 border-outflow-accent/30 text-white" />
            <CarouselNext className="ml-2 bg-outflow-accent/20 border-outflow-accent/30 text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ReviewsSection;
