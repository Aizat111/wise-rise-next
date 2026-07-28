import { useTranslations } from 'next-intl';

import Card from './Card';
import { cn } from '@/core/lib/utils';

type EmptyCardProps = {
  title?: string;
  description?: string;
  className?: string;
};

const EmptyCard = ({ title, description, className }: EmptyCardProps) => {
  const t = useTranslations();
  return (
    <Card className={cn('min-h-[300px] items-center justify-center', className)}>
      {title && <h2 className="text-2xl font-bold">{t(title) || title}</h2>}
      {description && <p className="text-sm">{t(description) || description}</p>}
    </Card>
  );
};

export default EmptyCard;
