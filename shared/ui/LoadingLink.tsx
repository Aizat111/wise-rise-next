'use client';

import { type LinkProps as NextLinkProps } from 'next/link';
import { type ReactNode } from 'react';

import { Link as NextLink } from '@/core/i18n/navigation';
import { useNavigationLoading } from '@/core/providers/NavigationLoadingProvider';

/* eslint-disable no-unused-vars */

interface LoadingLinkProps extends Omit<NextLinkProps, 'onClick'> {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void | undefined;
  prefetch?: boolean;
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  passHref?: boolean;
  id?: string;
}

export const Link = ({
  children,
  onClick,
  prefetch = true,
  className,
  target = '_self',
  rel,
  title,
  passHref,
  id,
  ...props
}: LoadingLinkProps) => {
  const { startLoading } = useNavigationLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if ((target === '_self' || !target) && !e.defaultPrevented) {
      startLoading();
    }
  };

  return (
    <NextLink
      href={props.href}
      onClick={handleClick}
      prefetch={prefetch}
      className={className}
      target={target}
      rel={rel}
      title={title}
      passHref={passHref}
      id={id}
      aria-label={title}
    >
      {children}
    </NextLink>
  );
};
