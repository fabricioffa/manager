import { FC } from "react";

type PaginatorProps = {
  totalCount: number;
  perPage: number;
  siblingCount?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const linksClasses =
  "inline-neighborhood  border border-blue-600 cursor-pointer py-2 px-4";
const disabledClasses = "pointer-events-none bg-slate-100";

const Paginator: FC<PaginatorProps> = ({
  totalCount,
  perPage,
  // siblingCount,
  currentPage,
  onPageChange,
}) => {
  const pagesNumber = Math.ceil(totalCount / perPage);
  const isActive = (i: number) =>
    currentPage === i ? "bg-blue-300 text-white" : "";
  const shouldDisable = (direction: "left" | "right") => {
    if (direction === "left") return currentPage === 0 && disabledClasses;
    return currentPage === pagesNumber - 1 && disabledClasses;
  };
  return (
    <nav className="py-12">
      <ol className="flex justify-center gap-1">
        <li>
          <a
            className={`${linksClasses} ${shouldDisable("left")}`}
            onClick={() => onPageChange(currentPage - 1)}
          >
            &lt;
          </a>
        </li>
        {[...Array(pagesNumber)].map((v, i) => (
          <li key={i}>
            <a
              className={`${linksClasses} ${isActive(i)}`}
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </a>
          </li>
        ))}
        <li>
          <a
            className={`${linksClasses} ${shouldDisable("right")}`}
            onClick={() => onPageChange(currentPage + 1)}
          >
            &gt;
          </a>
        </li>
      </ol>
    </nav>
  );
};

export default Paginator;
