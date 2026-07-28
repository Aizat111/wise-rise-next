'use client';

import { useTranslations } from 'next-intl';
import { type JSX, type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react';

import Pagination from '../paginations/Pagination';

import EmptyCard from '@/shared/components/card/EmptyCard';

export interface BaseTableProps {
  totalCount?: number;
  headerControls?: ReactNode | ReactElement | JSX.Element;
  footerControls?: ReactNode | ReactElement | JSX.Element;
  pagination?: boolean;
  paginationCurrent?: number;
  paginationTotal?: number;
  onChangepagination?: (_page: number) => void;
  loading?: boolean;
  fakeData?: boolean;
  fakeDataSize?: number;
  paginationPageSize?: number;
  dataSource?: any[];
  emptyDescription?: string;
  columns?: Record<string, unknown>[];
  tableEmpty?: ReactNode | ReactElement | JSX.Element;
  rowClassName?: (_row: Record<string, unknown>, _rowIndex: number) => string;
}

export type TableProps = BaseTableProps;

function Table(props: TableProps) {
  const {
    headerControls,
    loading,
    dataSource,
    fakeData,
    fakeDataSize,
    columns,
    rowClassName,
    pagination,
    paginationCurrent,
    onChangepagination,
    paginationPageSize,
    totalCount,
    emptyDescription,
    tableEmpty
  } = props;
  const t = useTranslations();
  const theadRef = useRef<HTMLTableSectionElement | null>(null);
  const [colWidths, setColWidths] = useState<number[]>([]);

  let expandedDataSource: Record<string, unknown>[] = dataSource || [];
  const isSmaller = expandedDataSource?.length < (fakeDataSize || 10);
  const haveData = expandedDataSource?.length > 0;

  if (isSmaller && fakeData && haveData) {
    if (expandedDataSource) {
      const difference = fakeDataSize ? fakeDataSize - expandedDataSource.length : 10 - expandedDataSource.length;
      for (let i = 0; i < difference; i++) {
        expandedDataSource = [...expandedDataSource, { fakeDataObject: true }];
      }
    }
  }

  const columnsTranslater = () => {
    const resultColumns: Record<string, unknown>[] = [];

    if (columns) {
      columns.forEach((item: Record<string, unknown>) => {
        const newItem = { ...item };
        const title = item?.title as string;
        const isTranslated = item?.isTranslated ?? true;

        newItem.title = isTranslated ? t(title ?? '') : title;

        resultColumns.push(newItem);
      });
    }

    return resultColumns;
  };

  // Measure header column widths to lock body skeleton widths and avoid layout shift
  useEffect(() => {
    if (!theadRef.current) return;
    const ths = Array.from(theadRef.current.querySelectorAll('th'));
    if (ths.length === 0) return;
    const widths = ths.map(th => th.getBoundingClientRect().width);
    setColWidths(widths);
  }, [columns]);

  return (
    <div className="bg-transparent rounded-xl shadow">
      {headerControls && <div className="flex justify-between items-center px-4 py-3 border-b ">{headerControls}</div>}
      <div className="min-h-[300px] overflow-x-auto">
        <div className="appTableWrapper">
          <table className="w-full text-sm text-left border-collapse">
            {colWidths.length > 0 && (
              <colgroup>
                {colWidths.map((w, idx) => (
                  // lock column widths based on measured header cells
                  <col key={idx} style={{ width: `${w}px` }} />
                ))}
              </colgroup>
            )}
            <thead ref={theadRef}>
              <tr className="bg-transparent">
                {columnsTranslater().map(col => (
                  <th
                    className={`px-0 pb-4 text-white70 text-sm font-medium ${col.className ?? ''}`}
                    key={col.dataIndex as string}
                  >
                    {col.title as string}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columnsTranslater().length} className="p-0">
                    <div className="w-full h-[400px] bg-toshi_body rounded-lg animate-pulse" />
                  </td>
                </tr>
              ) : (
                expandedDataSource?.map((row: Record<string, unknown>, rowIndex: number) => (
                  <tr key={rowIndex} className={rowClassName ? rowClassName(row, rowIndex) : ''}>
                    {columnsTranslater().map((col: Record<string, any>) => {
                      const bodyClass =
                        typeof col.bodyClassName === 'function'
                          ? col.bodyClassName(row, rowIndex)
                          : ((col.bodyClassName as string | undefined) ?? '');
                      return (
                        <td key={col.dataIndex as string} className={`px-0 py-1 ${bodyClass}`}>
                          {col.render ? col.render(row, rowIndex) : row[col.dataIndex as string]}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pagination && dataSource && dataSource.length > 0 && (
            <Pagination
              pageSize={paginationPageSize ?? 10}
              totalCount={totalCount ?? 10}
              onPageChange={onChangepagination ?? (() => {})}
              currentPage={paginationCurrent ?? 1}
            />
          )}
        </div>
        {!loading &&
          dataSource &&
          dataSource.length === 0 &&
          (tableEmpty ? tableEmpty : <EmptyCard description={emptyDescription ?? 'empty'} />)}
      </div>
    </div>
  );
}

export default Table;

Table.defaultProps = {
  pagination: false,
  fakeData: false,
  fakeDataSize: 10,
  paginationPageSize: 10
};
