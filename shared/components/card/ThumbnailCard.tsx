import type { FC } from 'react';

import Card from './Card';
import Image from '@/shared/ui/Images/Image';

interface ThumbnailCardProps {
  title: string;
  img: string;
}

const ThumbnailCard: FC<ThumbnailCardProps> = ({ title, img }) => {
  return (
    <Card className="min-w-[140px] gap-3 bg-bg_menu p-3 pt-5  justify-start items-center h-full w-full">
      <div className=" text-base md:text-base font-bold whitespace-nowrap text-white">{title}</div>
      <div className="relative w-fit flex flex-row gap-2.5 justify-center items-center bg-bg_menu py-2.5 px-3.75 rounded-md">
        <Image
          src={img}
          alt="ticket"
          width={70}
          height={70}
          className=" @[768px]:w-[90px] @[768px]:h-[90px] w-[70px] h-[70px]"
        />
      </div>
    </Card>
  );
};

export default ThumbnailCard;
