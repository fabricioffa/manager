type ItemsListProps = {
  children: JSX.Element[]
}

export const ItemsList = ({children}: ItemsListProps) => {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] gap-10 mt-20 contain-content">
        {children}
    </ul>
  )
}
