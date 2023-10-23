import type { ReactNode } from 'react';

type AccordionRegionProps = {
  children: ReactNode;
  elId: string;
  btnId: string;
  isOpen?: boolean;
  classes?: string;
};
const baseClasses =
  'overflow-hidden transition-[height] duration-500 ease-in-out';
const AccordionRegion = ({
  children,
  classes = baseClasses,
  isOpen = false,
  elId,
  btnId,
}: AccordionRegionProps) => {
  return (
    <div
      className={classes}
      style={{ height: isOpen ? '' : '0px' }}
      id={elId}
      aria-labelledby={btnId}
    >
      {children}
    </div>
  );
};

export default AccordionRegion;
