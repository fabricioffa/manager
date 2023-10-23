import AccordionBtn from '~/components/AccordionBtn';
import AccordionRegion from '~/components/AccordionRegion';
import NavLink from '~/components/NavLink';

type SubMenuProps = {
  btnText: string;
  links: [text: string, path: string][];
  className?: string;
};

const baseClasses = 'px-2 text-primary dark:font-medium dark:text-inherit';

const SubMenu = ({ links, btnText, className = baseClasses }: SubMenuProps) => {
  return (
    <li className={className}>
      <AccordionBtn
        elId={`${btnText}-btn`}
        regionId={`${btnText}-region`}
        className='p-2 text-lg font-bold hover:text-link aria-expanded:bg-highlight aria-expanded:text-link dark:border-l dark:border-slate-600 dark:aria-expanded:border-link  dark:aria-expanded:bg-inherit dark:aria-expanded:text-link-500'
      >
        {btnText}
      </AccordionBtn>

      <AccordionRegion btnId={`${btnText}-btn`} elId={`${btnText}-region`}>
        <ul>
          {links.map((link) => (
            <li className='px-2 text-primary dark:text-inherit' key={link[0]}>
              <NavLink
                href={link[1]}
                className='block data-active:bg-highlight data-active:font-medium data-active:text-link data-active:dark:bg-inherit data-active:dark:text-link-500'
              >
                {link[0]}
              </NavLink>
            </li>
          ))}
        </ul>
      </AccordionRegion>
    </li>
  );
};

export default SubMenu;
