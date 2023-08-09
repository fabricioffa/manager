import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";

type PaginatorProps = {
  totalCount: number;
  perPage: number;
  siblingCount?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Paginator: FC<PaginatorProps> = ({
  totalCount,
  perPage,
  // siblingCount,
  currentPage,
  onPageChange,
}) => {
  const pagesNumber = Math.ceil(totalCount / perPage);
  const isActive = (i: number) => currentPage === i;
  const shouldDisable = (direction: "left" | "right") => {
    if (direction === "left") return currentPage === 0;
    return currentPage === pagesNumber - 1;
  };
  return (
    <nav className="py-12">
      <ol className="flex justify-center gap-1">
        <li>
          <button
            disabled={shouldDisable("left")}
            className="inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon="caret-left" />
          </button>
        </li>
        {[...Array(pagesNumber)].map((v, i) => (
          <li key={i}>
            <button
              data-active={isActive(i)}
              className="inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700"
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            disabled={shouldDisable("right")}
            className="inline-block cursor-pointer border border-blue-600 px-4 py-2 disabled:pointer-events-none disabled:bg-slate-100 data-active:bg-blue-300 data-active:text-white dark:border-blue-700 dark:disabled:bg-slate-700  dark:data-active:bg-blue-700"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon="caret-right" />
          </button>
        </li>
      </ol>
    </nav>
  );
};

export default Paginator;
