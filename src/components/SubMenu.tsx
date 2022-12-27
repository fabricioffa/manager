type SubMenuProps = {
    children: JSX.Element[],
    isShowing: boolean,
};

const SubMenu = ({children, isShowing} : SubMenuProps) => {
    return (
        <ul className={`${isShowing && '!max-h-0 p-0'} max-h-28 overflow-hidden transition-all duration-500 ease-in-out child:indent-10`}>
            { children }
        </ul>
    )
}

export default SubMenu
