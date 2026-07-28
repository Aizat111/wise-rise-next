import { Button } from '@investorcentretb/toshi-ui';
import { useTranslations } from 'next-intl';

import Card from './Card';
import { cn } from '@/core/lib/utils';
import Image from '@/shared/ui/Images/Image';

type EmptyLoserCardProps = {
  title?: string;
  description?: string;
  className?: string;
  buttonText?: string;
  buttonAction?: () => void;
};

const EmptyLoserCard = ({ title, description, className, buttonText, buttonAction }: EmptyLoserCardProps) => {
  const t = useTranslations();
  return (
    <Card className={cn('min-h-[300px] items-center justify-center', className)}>
      <Image
        src="/assets/images/loser.png"
        alt="empty loser"
        width={515}
        height={380}
        className="aspect-[515/380] object-cover"
      />
      <div className="mb-4">
        {title && <h4 className="text-sm font-bold">{t(title)}</h4>}
        {description && <p className="text-sm">{t(description)}</p>}
      </div>

      {buttonText && (
        <Button onClick={buttonAction} intent="primary" appearance="glossy" borderRadius="md">
          {t(buttonText)}
        </Button>
      )}
    </Card>
  );
};

export default EmptyLoserCard;
