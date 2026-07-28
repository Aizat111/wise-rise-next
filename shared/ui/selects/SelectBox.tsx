import { type FC } from 'react';

import Select, { type SearchableSelectProps } from './Select';
import { cn } from '@/core/lib/utils';

interface SelectBoxProps extends SearchableSelectProps {
  title?: string;
  classNameBox?: string;
}

const SelectBox: FC<SelectBoxProps> = ({ classNameBox, ...props }) => {
  return (
    <div className={cn('w-full py-0.5 h-[48px] flex items-center gap-2 bg-bg_menu rounded-md pl-3 pr-3', classNameBox)}>
      {props.title && <span className="text-base font-medium text-white50 shrink-0">{props.title}</span>}
      <div className="flex-1 min-w-0">
        <Select {...props} />
      </div>
    </div>
  );
};

export default SelectBox;
