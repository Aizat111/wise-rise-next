import { Button } from '@investorcentretb/toshi-ui';
import type { FC } from 'react';

import Image from '@/shared/ui/Images/Image';
import { Link } from '@/shared/ui/LoadingLink';

interface VerticalTextImgCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  target?: string;
  image: string;
}

const VerticalTextImgCard: FC<VerticalTextImgCardProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  image,
  target = '_blank'
}) => {
  return (
    <div className="relative bg-toshi_body overflow-hidden items-start @[768px]:items-center flex-col  pl-6 @[768px]:flex-row @[768px]:pt-6.75 @[768px]:pb-11  gap-16 pb-12 @[768px]:gap-6 flex rounded-xl  @[768px]:pl-10  py-10 pb-0 ">
      <div className="relative flex-shrink-0 flex-col gap-6 flex rounded-md h-full">
        <div className="relative w-full max-w-[415px] flex-col gap-5 pr-4 flex rounded-md h-full">
          <h2 className="text-lg font-bold text-white ">{title}</h2>
          <p className="text-base font-semibold text-grey"> {description} </p>
        </div>
        <Link href={buttonLink} className="w-fit" target={target}>
          <Button className="w-fit" size="lg" intent="primary" appearance="glossy" borderRadius="md">
            {buttonText}
          </Button>
        </Link>
      </div>

      <div className="flex-shrink-0 flex justify-center @[768px]:pl-40 @[768px]:py-0 pl-0 py-8.5 @[768px]:pt-0 ">
        <Link href={buttonLink} target={target}>
          <Image
            src={image}
            alt={title}
            width={648}
            height={271}
            className="position-absolute object-cover object-left"
            style={{
              height: '271px',
              width: '700px !important',
              minWidth: '700px !important',
              maxWidth: 'none !important',
              opacity: 0.9,
              boxShadow:
                '0 5.033px 244.101px 0 rgba(0, 0, 0, 0.45) inset, 18.874px 18.874px 13.841px 0 rgba(0, 0, 0, 0.70), 12.583px 12.583px 314.563px 0 var(--Green, #67DF30)'
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default VerticalTextImgCard;
