import Link from "next/link"

interface TopMenuItemProps{
  item: string
  pageRef: string
}

export default function TopMenuItem({item, pageRef}: TopMenuItemProps){
  return(
    <Link
      href={pageRef}
      className="relative group px-2 lg:px-4 xl:px-6 2xl:px-8 py-2 xl:py-3 h-full flex items-center whitespace-nowrap text-[10px] lg:text-[12px] xl:text-[13px] 2xl:text-[15px] font-mono uppercase tracking-[0.15em] lg:tracking-[0.25em] xl:tracking-[0.3em] 2xl:tracking-[0.35em] text-foreground/70 hover:text-foreground transition-all duration-300"
    >
      {item}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] xl:h-[1.5px] bg-accent/50 group-hover:w-full transition-all duration-500" />
    </Link>
  )
}