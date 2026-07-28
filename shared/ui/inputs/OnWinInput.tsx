import { Button } from '@investorcentretb/toshi-ui';
import { Percent } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import Input from './Input';

type OnIncreaseByInputProps = {
  form: any;
  dispatch: any;
  setFormField: any;
  handleChange: any;
  field: string;
  fieldOption: string;
  label: string;
  disabled?: boolean;
};

const OnIncreaseByInput: FC<OnIncreaseByInputProps> = ({
  form,
  dispatch,
  setFormField,
  handleChange,
  field,
  fieldOption,
  label,
  disabled
}) => {
  const t = useTranslations();
  return (
    <div className="flex gap-2 flex-col items-start">
      <div>
        <span className="text-sm text-white70">{t(label)}</span>
      </div>
      <div className="flex gap-2 flex-row w-full items-center">
        <div className="bg-bg_content rounded-md flex p-1.5 gap-1.5">
          <Button
            appearance="menu"
            intent="gray"
            size="xs"
            isActive={form[fieldOption] === 0}
            className="!px-1.5"
            disabled={disabled}
            onClick={() => dispatch(setFormField({ field: fieldOption, value: 0 }))}
          >
            {t('reset')}
          </Button>
          <Button
            appearance="menu"
            intent="gray"
            size="xs"
            isActive={form[fieldOption] === 1}
            className="!px-1.5"
            disabled={disabled}
            onClick={() => dispatch(setFormField({ field: fieldOption, value: 1 }))}
          >
            {t('increase_by')}
          </Button>
        </div>
        <Input
          type="number"
          rightIcon={<Percent className="text-white70 size-4" />}
          isTranslated
          className="bg-bg_content w-full"
          fontSize="base"
          min={0}
          max={1000000}
          disabledOnlyInput={form[fieldOption] === 0}
          disabled={disabled}
          labelClassName="text-sm"
          defaultValue={form[field]}
          onChange={handleChange(field)}
          containerClassName="order-5 xl:order-4"
        />
      </div>
    </div>
  );
};

export default OnIncreaseByInput;
