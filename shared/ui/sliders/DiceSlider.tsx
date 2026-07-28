import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setFormField } from '@/core/redux-toolkit/slices/diceSlice';
import { RootState } from '@/core/redux-toolkit/store';

const DiceSlider = () => {
  const { form, autoPlay, automaticRunning, isProcessing, isLoading } = useSelector((state: RootState) => state.dice);
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sliderContainerRef.current;
    if (!el) return;

    let attached = false;

    const onDocTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      document.addEventListener('touchmove', onDocTouchMove, { passive: false });
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      document.removeEventListener('touchmove', onDocTouchMove);
    };

    el.addEventListener('touchstart', attach, { passive: true });
    el.addEventListener('touchend', detach, { passive: true });
    el.addEventListener('touchcancel', detach, { passive: true });

    return () => {
      detach();
      el.removeEventListener('touchstart', attach);
      el.removeEventListener('touchend', detach);
      el.removeEventListener('touchcancel', detach);
    };
  }, []);
  const marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
  };
  return (
    <div className="w-full mx-auto bg-toshi_body border border-white10 px-8 rounded-lg h-[150px] flex justify-center items-center">
      {/* Slider value bubble (visible while dragging) */}
      {isDragging && (
        <div className="relative" style={{ left: `calc(${form.sliderValue}% - 35px)` }}>
          <div className={`absolute -top-12 px-3 py-1 rounded-md text-white bg-green-700 text-sm font-semibold`}>
            {form.sliderValue}%
          </div>
        </div>
      )}
      <div ref={sliderContainerRef} className="w-full">
        <Slider
          className="dice-slider"
          min={2}
          max={98}
          value={form.sliderValue}
          onBeforeChange={() => setIsDragging(true)}
          onChange={(val: number | number[]) => {
            if (Array.isArray(val)) {
              return;
            }
            const value = val as number;
            if (value < 2 || value > 98) {
              return;
            }
            dispatch(setFormField({ field: 'sliderValue', value: val }));
          }}
          onChangeComplete={() => setIsDragging(false)}
          marks={marks}
          dots={false}
          disabled={(autoPlay === 'auto' && automaticRunning) || isProcessing || isLoading}
          styles={{
            track: {
              backgroundColor: form.roleType === 1 ? 'red' : 'green',
              height: 12,
              borderRadius: 8
            },
            handle: {
              backgroundColor: 'white',
              borderColor: 'white',
              width: 24,
              height: 24,
              marginTop: -6
            },
            rail: {
              backgroundColor: form.roleType === 1 ? 'green' : 'red',
              height: 12,
              borderRadius: 8
            }
          }}
        />
      </div>
    </div>
  );
};

export default DiceSlider;
