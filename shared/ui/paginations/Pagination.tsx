import { Button } from '@investorcentretb/toshi-ui';
import type { FC } from 'react';

import { cn } from '@/core/lib/utils';
import { DOTS, usePagination } from '@/shared/utils/usePagination';

type Props = {
  onPageChange: (_page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
};

const Pagination: FC<Props> = ({ onPageChange, totalCount, siblingCount, currentPage, pageSize }) => {
  const paginationRange = usePagination(totalCount, pageSize, siblingCount, currentPage);

  if (!paginationRange || currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex flex-wrap items-center justify-center pt-10 mb-4">
      <ul className="flex items-center gap-1">
        {currentPage !== 1 && (
          <li>
            <Button onClick={onPrevious} appearance="solid" intent="gray">
              ‹
            </Button>
          </li>
        )}

        {paginationRange?.map((pageNumber: any, index) => {
          if (pageNumber === DOTS) {
            return (
              <li key={index}>
                <Button appearance="solid" intent="gray" className="px-3 py-1 text-gray-400">
                  …
                </Button>
              </li>
            );
          }

          return (
            <li key={index}>
              <Button
                onClick={() => onPageChange(pageNumber)}
                appearance="solid"
                isActive={pageNumber === currentPage}
                activeAppearance="outline-soft"
                activeIntent="primary"
                intent="gray"
                className={cn(pageNumber === currentPage && 'bg-primary-500/10 text-white')}
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}

        {currentPage !== lastPage && (
          <li>
            <Button onClick={onNext} appearance="solid" intent="gray">
              ›
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
