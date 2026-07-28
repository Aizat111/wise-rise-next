'use client';

import { useTranslations } from 'next-intl';
import Slider from 'rc-slider';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/core/lib/utils';
import { setFormField } from '@/core/redux-toolkit/slices/plinkoSlice';
import { RootState } from '@/core/redux-toolkit/store';

const valhallaLevels = {
  0: 'off',
  1: 'low',
  2: 'mid',
  3: 'high'
};

const PlinkoSlider = ({ disabled }: { disabled?: boolean }) => {
  const t = useTranslations();
  const { form } = useSelector((state: RootState) => state.plinko);
  const dispatch = useDispatch();

  return (
    <div className={'w-full'}>
      <label htmlFor={'plinko_slider'} className={cn('mb-1 block text-sm text-white70')}>
        {t('toshi_valhalla')}
      </label>
      <div className={cn('relative w-full rounded-md bg-bg_content h-[40px] flex items-center px-4 py-2 gap-2')}>
        <div className={cn('relative text-white70')}>
          {t(valhallaLevels[form.valhallaLevel as keyof typeof valhallaLevels])}
        </div>

        <Slider
          id={'plinko_slider'}
          min={0}
          max={3}
          step={1}
          value={form.valhallaLevel}
          onChange={value => {
            dispatch(setFormField({ field: 'valhallaLevel', value: value }));
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

PlinkoSlider.displayName = 'PlinkoSlider';

export default PlinkoSlider;
