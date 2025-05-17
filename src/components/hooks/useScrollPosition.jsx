import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const updatePosition = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsScrolled(position > window.innerHeight * 0.7); // Show after 70% of viewport height
    };
    
    window.addEventListener('scroll', updatePosition);
    
    // Initial check
    updatePosition();
    
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  
  return { scrollPosition, isScrolled };
}
