'use client';

import { Children, type FC, type ReactNode, useEffect, useRef, useState } from 'react';

import { setControls } from '@/core/lib/carouselControlsStore';
import type { HorizontalCarouselControls } from '@/core/types/carousel.types';

interface HorizontalBetCarouselProps {
  children: ReactNode | ReactNode[];
  paddingTop?: string;
  onControlsChange?: (_controls: HorizontalCarouselControls) => void;
  sectionId?: string;
}

const HorizontalBetCarousel: FC<HorizontalBetCarouselProps> = ({
  children,
  paddingTop = 'pt-2.5',
  onControlsChange,
  sectionId
}) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

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

  // Notify parent about control state and handlers whenever state changes
  useEffect(() => {
    if (!onControlsChange) return;
    const controls: HorizontalCarouselControls = {
      scrollLeft: () => scrollBy(-300),
      scrollRight: () => scrollBy(300),
      canScrollLeft,
      canScrollRight
    };
    onControlsChange(controls);
  }, [canScrollLeft, canScrollRight, onControlsChange]);

  // Publish controls globally by sectionId for SectionHeader consumption
  useEffect(() => {
    if (!sectionId) return;
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
  }, [sectionId, canScrollLeft, canScrollRight]);

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const items = Children.toArray(children);

  return (
    <div className="relative">
      <div className="relative">
        <div ref={scrollerRef} className={`slider bet-carousel ${paddingTop} mt-0`} style={{ gridAutoColumns: 'auto' }}>
          {items.map((child, idx) => (
            <div key={idx} className="slider-item">
              {child}
            </div>
          ))}
        </div>
        <div
          className="absolute top-0 right-0 w-[120px] h-full pointer-events-none z-2 max-sm:hidden md:block"
          style={{
            background: 'linear-gradient(90deg, rgba(4, 10, 41, 0) 0%, #040A29 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default HorizontalBetCarousel;
