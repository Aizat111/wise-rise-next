import React from 'react';

import Image from '../Images/Image';

import { cn } from '@/core/lib/utils';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizeClasses[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 32px, (max-width: 1200px) 63px, 62px"
      />
    </div>
  );
};

export default Avatar;
