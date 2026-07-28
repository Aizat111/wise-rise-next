'use client';

import { Button } from '@investorcentretb/toshi-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Children, type FC, type ReactNode, useEffect, useRef, useState } from 'react';

import { COLORS } from '@/core/constants/colors.constants';
import { setControls } from '@/core/lib/carouselControlsStore';
import type { HorizontalCarouselControls } from '@/core/types/carousel.types';

interface HorizontalCarouselProps {
  children: ReactNode | ReactNode[];
  showScrollButtons?: boolean;
  paddingTop?: string;
  sectionId?: string;
}

const HorizontalCarousel: FC<HorizontalCarouselProps> = ({
  children,
  showScrollButtons = true,
  paddingTop = 'pt-2.5',
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

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

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

  const items = Children.toArray(children);

  return (
    <div className="relative" id={sectionId}>
      <div className="relative">
        <div ref={scrollerRef} className={`slider ${paddingTop} mt-0`}>
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
      {showScrollButtons && canScrollLeft && (
        <Button
          aria-label="Scroll left"
          icon={<ChevronLeft className="size-[18px]" color={COLORS.primary[500]} />}
          iconOnly
          intent="gray"
          appearance="solid"
          borderRadius="md"
          className="absolute right-9 -top-6 w-[30px] h-[30px] grid place-items-center rounded bg-toshi_body hidden-in-mobile lg:block"
          onClick={() => scrollBy(-300)}
        ></Button>
      )}
      {showScrollButtons && canScrollRight && (
        <Button
          aria-label="Scroll right"
          iconOnly
          icon={<ChevronRight className="size-[18px]" color={COLORS.primary[500]} />}
          intent="gray"
          appearance="solid"
          borderRadius="md"
          className="absolute right-0 -top-6 w-[30px] h-[30px] grid place-items-center rounded bg-toshi_body hidden-in-mobile lg:block"
          onClick={() => scrollBy(300)}
        ></Button>
      )}
    </div>
  );
};

export default HorizontalCarousel;
