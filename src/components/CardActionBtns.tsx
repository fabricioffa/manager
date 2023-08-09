import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { FC } from "react";

export type CardActionBtnsProps = {
  profileLink: string;
  editLink: string;
  deleteFunc: () => void;
};

const CardActionBtns: FC<CardActionBtnsProps> = ({
  deleteFunc,
  editLink,
  profileLink,
}) => {
  return (
    <div className="mt-auto flex gap-2 pt-4">
      <Link
        href={profileLink}
        className="grow rounded-lg border
        border-blue-700 bg-blue-400 dark:bg-link-700 text-center font-semibold text-white"
      >
        <span className="max-lg:hidden">Ver</span>
        <FontAwesomeIcon
          icon="eye"
          size="lg"
          className="justify-self-center lg:hidden"
        />
      </Link>
      <Link
        href={editLink}
        className="grow rounded-lg border
        border-blue-700 bg-blue-400 dark:bg-link-700 dark:border-none text-center font-semibold text-white"
      >
        <span className="max-lg:hidden">Editar</span>
        <FontAwesomeIcon
          icon="pen-to-square"
          size="lg"
          className="justify-self-center lg:hidden"
        />
      </Link>
      <button
        onClick={() => deleteFunc()}
        className="grow rounded-lg border border-red-700 bg-red-400 dark:bg-red-800 dark:border-none font-semibold text-white"
      >
        <span className="max-lg:hidden">Excluir</span>
        <FontAwesomeIcon
          icon="trash"
          size="lg"
          className="justify-self-center lg:hidden"
        />
      </button>
    </div>
  );
};

export default CardActionBtns;
