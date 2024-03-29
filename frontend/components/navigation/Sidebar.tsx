import Link from "next/link";
import {
  ArrowUpTrayIcon as ArrowUpTrayIconOutline,
  CircleStackIcon as CircleStackIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  BriefcaseIcon as BriefcaseIconOutline,
  ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconOutline,
} from "@heroicons/react/24/outline";
import {
  ArrowUpTrayIcon as ArrowUpTrayIconSolid,
  CircleStackIcon as CircleStackIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconSolid,
} from "@heroicons/react/24/solid";
import Image from "next/image";
const tfrLogo = require("../../public/tfr-logo.svg") as string;
const tfrLogoMobile = require("../../public/rondas-mobile.png") as string;
import { useRouter } from "next/router";

function NavItem({
  OutlineIcon,
  SolidIcon,
  text,
  link,
  active,
  color,
}: {
  OutlineIcon: React.ElementType;
  SolidIcon: React.ElementType;
  text: string;
  link: string;
  active: boolean;
  color: string;
}) {
  let itemStyle = `flex text-lg my-2 md:my-3 items-center rounded-lg py-2 md:py-4 md:pb-3 px-4 hover:bg-dbeige/10 ${color}`;
  if (active) {
    itemStyle += " bg-dbeige/5 text-black font-body-500";
  }

  let iconStyle = "h-6 w-6 mb-0.5 lg:mr-4";

  return (
    <Link href={link} className={`font-body`}>
      <li className={itemStyle}>
        {active ? (
          <SolidIcon className={iconStyle} />
        ) : (
          <OutlineIcon className={iconStyle} />
        )}
        <span className="hidden lg:block">{text}</span>
      </li>
    </Link>
  );
}

export default function Sidebar() {
  const router = useRouter();
  return (
    <nav className="fixed md:relative md:px-3 bottom-0 w-full md:w-none z-50 bg-white md:bg-transparent border-t md:border-none shadow-[0px_-1px_5px_0px_rgba(0,0,0,0.05)] md:shadow-none">
      <Link href="/">
        <div className="hidden md:block lg:hidden border rounded-lg">
          <div className="py-4 pb-3 my-3 mx-auto relative h-6 w-6">
            <Image
              src={tfrLogoMobile}
              alt="Rondas Logo Mobile"
              fill={true}
              style={{
                objectFit: "contain",
              }}
              priority={true}
              sizes="24px"
            />
          </div>
        </div>
        <div className="hidden lg:block relative w-[150px] h-[50px] mx-4 mb-7">
          <Image
            src={tfrLogo}
            alt="Rondas Logo"
            fill={true}
            style={{
              objectFit: "contain",
            }}
            priority={true}
          />
        </div>
      </Link>
      <ul className="flex justify-between px-4 md:px-0 md:block">
        <NavItem
          OutlineIcon={CircleStackIconOutline}
          SolidIcon={CircleStackIconSolid}
          text="Items"
          link="/building-elements/items"
          active={
            router.asPath === "/building-elements/items" ||
            router.asPath === "/"
          }
          color="text-item"
        />
        <NavItem
          OutlineIcon={ArrowUpTrayIconOutline}
          SolidIcon={ArrowUpTrayIconSolid}
          text="Upload"
          link="/building-elements/items/upload"
          active={router.asPath === "/building-elements/items/upload"}
          color="text-item"
        />
        <div className="border-b"></div>
        <NavItem
          OutlineIcon={ArrowPathRoundedSquareIconOutline}
          SolidIcon={ArrowPathRoundedSquareIconSolid}
          text="Collectors"
          link="/building-elements/collectors"
          active={router.asPath === "/building-elements/collectors"}
          color="text-collector"
        />
        <NavItem
          OutlineIcon={ArrowUpTrayIconOutline}
          SolidIcon={ArrowUpTrayIconSolid}
          text="Upload"
          link="/building-elements/collectors/upload"
          active={router.asPath === "/building-elements/collectors/upload"}
          color="text-collector"
        />
        <div className="border-b"></div>
        <NavItem
          OutlineIcon={BriefcaseIconOutline}
          SolidIcon={BriefcaseIconSolid}
          text="Contractors"
          link="/building-elements/contractors"
          active={router.asPath === "/building-elements/contractors"}
          color="text-contractor"
        />
        <NavItem
          OutlineIcon={ArrowUpTrayIconOutline}
          SolidIcon={ArrowUpTrayIconSolid}
          text="Upload"
          link="/building-elements/contractors/upload"
          active={router.asPath === "/building-elements/contractors/upload"}
          color="text-contractor"
        />
        <div className="border-b "></div>
        <NavItem
          OutlineIcon={MagnifyingGlassIconOutline}
          SolidIcon={MagnifyingGlassIconSolid}
          text="Matches"
          link="/building-elements/matches"
          active={router.asPath === "/building-elements/matches"}
          color="text-black"
        />
      </ul>
    </nav>
  );
}
