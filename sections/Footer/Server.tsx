import ContactUs from "@/components/Server/ContactUs";
import DashedLink from "@/components/Server/DashedLink";
import LogoFull from "@/components/SVGComponents/LogoFull";
import Link from "next/link";


interface LinkItem {
  href: string;
  link: string;
}

const data: LinkItem[] = [
  { href: "", link: "Home" },
  {
    href: "https://elementis.co/destinations",
    link: "Destinations",
  },
  {
    href: "https://elementis.co/wellness",
    link: "Wellness",
  },
  {
    href: "https://elementis.co/innovation",
    link: "Innovation",
  },
  {
    href: "https://elementis.co/sustainability",
    link: "Nature",
  },
  {
    href: "https://elementis.co/community",
    link: "Community",
  },
  {
    href: "https://elementis.co/the-story",
    link: "The Story",
  },
  {
    href: "https://elementis.co/the-story",
    link: "New Developments",
  },
  {
    href: "https://elementis.co/the-story",
    link: "Press Room",
  },
  {
    href: "https://elementis.co/the-story",
    link: "Careers",
  },
];

const FooterServer = () => {
  return (
    <div className="bg-[#2B3530] md:px-16">
      <div className="grid grid-rows-[repeat(4,auto)] border-b border-white/50 px-3-75 py-20 text-[#D1CCBF] md:grid-cols-[1fr_1.375fr] md:grid-rows-2 
      md:px-0 md:pt-36 md:pb-28-75 [&_.animated-underline]:bg-[#D1CCBF]"
      >
        <div>
          <LogoFull className="h-auto w-1/2 [&_path]:fill-[white]" />
          <ContactUs className="mt-17-5 hidden w-fit flex-col gap-y-8 text-base max-md:mt-16 md:flex [&>div]:gap-6 md:[&>div]:gap-4" />
        </div>

        <ol className="mt-20 grid grid-flow-col-dense grid-cols-2 grid-rows-5 gap-y-5 overflow-hidden text-xl leading-[1.1] font-light text-nowrap md:mt-0 md:gap-y-6-5 md:text-30">
          {data.map((eachColData, i) =>
            i === 0 ? (
              <div
                key={"list-item-" + (i + 1)}
                className="underline decoration-[#D1CCBF] decoration-1 underline-offset-2"
              >
                {eachColData.link}
              </div>
            ) : (
              <Link href={eachColData.href} key={"list-item" + (i + 1)}>
                <DashedLink
                  key={"list-item-" + (i + 1)}
                  className="w-fit leading-none [&_.animated-underline]:bg-[#D1CCBF]"
                >
                  {eachColData.link}
                </DashedLink>
              </Link>
            ),
          )}
        </ol>
      </div>
    </div>
  )
}

export default FooterServer