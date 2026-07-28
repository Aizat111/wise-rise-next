import type { FC } from 'react';

import Card from './Card';

interface DescriptionCardProps {
  title: string;
  description?: string;
}

const DescriptionCard: FC<DescriptionCardProps> = ({ title, description }) => {
  return (
    <Card className="@[768px]:gap-8 gap-6">
      <div className="relative w-full  max-w-607 flex-col flex rounded-md h-full">
        <div className="text-lg font-byrd uppercase font-bold text-white ">{title.toUpperCase()}</div>
      </div>

      <div className="relative w-full flex-col  max-w-[607px] gap-xsgap flex rounded-xl ">
        <p className="text-base text-grey"> {description} </p>
      </div>
    </Card>
  );
};

export default DescriptionCard;
