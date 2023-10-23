import type { LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = (
  props: LinkProps & { children: ReactNode; className: string }
) => {
  const { pathname } = useRouter();

  return (
    <Link data-active={pathname === props.href} {...props}>
      {props.children}
    </Link>
  );
};

export default NavLink;
