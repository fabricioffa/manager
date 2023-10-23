import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FC } from 'react';

type PaginatorProps = {
  totalCount: number;
  perPage: number;
  siblingsCount?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Paginator: FC<PaginatorProps> = ({
  totalCount,
  perPage,
  siblingsCount = 4,
  currentPage,
  onPageChange,
}) => {
  const pagesNumber = Math.ceil(totalCount / perPage);
  const pages = [...Array(pagesNumber).keys()];
  const lastPage = pages.length - 1;

  let start = currentPage - siblingsCount / 2;
  let end = currentPage + siblingsCount / 2;
  end = start < 0 ? Math.abs(start) + end : end;
  start = start < 0 ? 0 : start;
  start = end > lastPage ? start + lastPage - end : start;
  const visiblePages = pages.length > 6 ? pages.slice(start, end + 1) : pages;

  const showDots = {
    start: (visiblePages.at(0) || 0) > 0,
    end: (visiblePages.at(-1) || 0) < lastPage,
  };

  return (
    <nav className='py-12'>
      <ol className='flex justify-center gap-1'>
        <li>
          <button
            disabled={currentPage === 0}
            className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700'
            onClick={() => onPageChange(0)}
          >
            <FontAwesomeIcon icon='forward' className='-rotate-180' />
          </button>
        </li>
        <li>
          <button
            disabled={currentPage === 0}
            className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700'
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon='caret-left' />
          </button>
        </li>
        {showDots.start && (
          <li className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700 max-sm:hidden'>
            ...
          </li>
        )}
        <li className='sm:hidden'>
          <button
            data-active='true'
            className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700  dark:disabled:bg-slate-700 dark:data-active:bg-blue-700'
          >
            {currentPage + 1}
          </button>
        </li>
        {visiblePages.map((page) => (
          <li key={page} className='max-sm:hidden'>
            <button
              data-active={currentPage === page}
              className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700'
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
          </li>
        ))}
        {showDots.end && (
          <li className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700 max-sm:hidden'>
            ...
          </li>
        )}
        <li>
          <button
            disabled={currentPage === lastPage}
            className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700'
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon='caret-right' />
          </button>
        </li>
        <li>
          <button
            disabled={currentPage === lastPage}
            className='inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700'
            onClick={() => onPageChange(lastPage)}
          >
            <FontAwesomeIcon icon='forward' />
          </button>
        </li>
      </ol>
    </nav>
  );
};

export default Paginator;
