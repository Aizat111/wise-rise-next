import { FC, useEffect, useRef, useState } from 'react';

import { setControls } from '@/core/lib/carouselControlsStore';
import { HorizontalCarouselControls } from '@/core/types/carousel.types';

interface CarouselFlexProps {
  children: React.ReactNode;
  sectionId: string;
}
const CarouselFlex: FC<CarouselFlexProps> = ({ children, sectionId }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Update scroll button states
  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  // Scroll handler
  const scrollBy = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Set up scroll listeners
  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    const listener = () => updateButtons();
    el.addEventListener('scroll', listener, { passive: true });
    window.addEventListener('resize', listener);
    return () => {
      el.removeEventListener('scroll', listener);
      window.removeEventListener('resize', listener);
    };
  }, []);

  // Register controls with carousel store
  useEffect(() => {
    const controls: HorizontalCarouselControls = {
      scrollLeft: () => scrollBy(-300),
      scrollRight: () => scrollBy(300),
      canScrollLeft,
      canScrollRight
    };
    setControls(sectionId, controls);
    return () => {
      setControls(sectionId, null);
    };
  }, [canScrollLeft, canScrollRight]);
  return (
    <div
      ref={scrollerRef}
      id="calendar-items"
      className="flex flex-row gap-3 justify-start overflow-x-auto overflow-y-hidden no-scrollbar"
    >
      {children}
    </div>
  );
};

export default CarouselFlex;
