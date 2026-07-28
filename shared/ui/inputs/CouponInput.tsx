import React, { FC, useEffect, useState } from 'react';

import Input from './Input';
import { useDebounce } from '@/shared/hooks/useDebounce';

type CouponInputProps = {
  setText: (_coupon: string) => void;
  couponCode: string;
};

const CouponInput: FC<CouponInputProps> = ({ setText, couponCode }) => {
  const [coupon, setCoupon] = useState<string[]>(['', '', '', '', '', '']);

  const debouncedText = useDebounce(coupon.join(''), 300);

  const inputRefs: React.RefObject<HTMLInputElement | null>[] = Array(6)
    .fill(null)
    .map(() => React.createRef());

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const newOtp = [...coupon];
    newOtp[index] = value;
    setCoupon(newOtp);
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !coupon[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();

    // Sadece alfanumerik karakterleri al
    const cleanedText = pastedText.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);

    if (cleanedText.length > 0) {
      const newCoupon = [...coupon];

      // Yapıştırılan metni input alanlarına dağıt
      for (let i = 0; i < 6; i++) {
        newCoupon[i] = cleanedText[i] || '';

        inputRefs[i + 1]?.current?.focus();
      }

      setCoupon(newCoupon);
    }
  };

  useEffect(() => {
    setText(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    if (!couponCode) {
      setCoupon(['', '', '', '', '', '']);
    }
  }, [couponCode]);

  return coupon.map((value, index) => (
    <Input
      onChange={e => handleChange(index, e.target.value)}
      onKeyDown={e => handleKeyDown(index, e)}
      onPaste={e => handlePaste(index, e)}
      key={index}
      maxLength={1}
      ref={inputRefs[index]}
      value={value}
      size="lg"
      background="transparent"
      className="w-full text-lg @[768px]:max-w-[43px] @[768px]:max-h-[43px] h-fit @[768px]:p-1 p-3 text-center border border-white30"
    />
  ));
};

export default CouponInput;
