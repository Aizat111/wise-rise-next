import type { FC } from 'react';

interface UDstatcardProps {
  title: string;
  value: string;
}

const UDstatcard: FC<UDstatcardProps> = ({ title, value }) => {
  return (
    <div className=" px-3 py-2 bg-white10 rounded-xl inline-flex flex-col justify-center items-start ">
      <div className=" flex flex-col justify-start items-start gap-1">
        <div className=" justify-start text-white70 text-base font-semibold">{title}</div>
        <div className=" justify-start text-white text-base font-semibold  ">{value}</div>
      </div>
    </div>
  );
};

export default UDstatcard;
