import type { ReactNode } from 'react';
import { useRef } from 'react';

type AccordionBtnProps = {
  regionId: string;
  elId: string;
  children: ReactNode;
  isExpanded?: boolean;
  className: string;
};

const AccordionBtn = ({
  children,
  regionId,
  elId,
  isExpanded = false,
  className,
}: AccordionBtnProps) => {
  const btnRef = useRef<null | HTMLButtonElement>(null);

  const toogleAccordion = () => {
    const accordionRegion = document.querySelector<HTMLDivElement>(
      `#${regionId}`
    );
    if (!accordionRegion || !btnRef.current) return;
    const accordionRegionHeight = document.querySelector<HTMLElement>(
      `#${regionId} :first-child`
    )?.clientHeight;
    if (btnRef.current.ariaExpanded === 'true') {
      accordionRegion.style.height = '0px';
      btnRef.current.ariaExpanded = 'false';
    } else {
      accordionRegion.style.height = `${accordionRegionHeight}px`;
      btnRef.current.ariaExpanded = 'true';
    }
  };

  return (
    <button
      aria-controls={regionId}
      aria-expanded={isExpanded}
      className={className}
      onClick={toogleAccordion}
      id={elId}
      ref={btnRef}
    >
      {children}
    </button>
  );
};

export default AccordionBtn;
