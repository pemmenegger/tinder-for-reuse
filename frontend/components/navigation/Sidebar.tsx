import Link from "next/link";
import {
  HomeIcon as HomeIconOutline,
  CubeIcon as CubeIconOutline,
  ShoppingBagIcon as ShoppingBagIconOutline,
  UserCircleIcon as UserCircleIconOutline,
  ArrowUpTrayIcon as ArrowUpTrayIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  CubeIcon as CubeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  ArrowUpTrayIcon as ArrowUpTrayIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
} from "@heroicons/react/24/solid";
import Image from "next/image";
const rondasLogo = require("../../public/rondas-logo-v3.svg") as string;
const rondasLogoMobile = require("../../public/rondas-mobile.png") as string;
import { useRouter } from "next/router";

function NavItem({
  OutlineIcon,
  SolidIcon,
  text,
  link,
  active,
}: {
  OutlineIcon: React.ElementType;
  SolidIcon: React.ElementType;
  text: string;
  link: string;
  active: boolean;
}) {
  let itemStyle =
    "flex text-lg my-2 md:my-3 items-center rounded-lg py-2 md:py-4 md:pb-3 px-4 hover:bg-rondas-beige-dark/10";
  if (active) {
    itemStyle += " bg-rondas-beige-dark/5 text-black font-body-500";
  }

  let iconStyle = "h-6 w-6 mb-0.5 lg:mr-4";

  return (
    <Link href={link} className="font-body">
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
              src={rondasLogoMobile}
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
        <div className="hidden lg:block relative w-[125px] h-[27px] mx-4 mb-7">
          <Image
            src={rondasLogo}
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
          OutlineIcon={MagnifyingGlassIconOutline}
          SolidIcon={MagnifyingGlassIconSolid}
          text="Search"
          link="/building-elements/search"
          active={router.asPath === "/building-elements/search"}
        />
        <NavItem
          OutlineIcon={ArrowUpTrayIconOutline}
          SolidIcon={ArrowUpTrayIconSolid}
          text="Upload"
          link="/building-elements/upload"
          active={router.asPath === "/building-elements/upload"}
        />
        <div className="border-b "></div>
        <NavItem
          OutlineIcon={UserCircleIconOutline}
          SolidIcon={UserCircleIconSolid}
          text="My Account"
          link="/account"
          active={router.asPath === "/account"}
        />
        <NavItem
          OutlineIcon={UserCircleIconOutline}
          SolidIcon={UserCircleIconSolid}
          text="My Uploads"
          link="/my-uploads"
          active={router.asPath === "/my-uploads"}
        />
        <div className="border-b "></div>
        <NavItem
          OutlineIcon={CubeIconOutline}
          SolidIcon={CubeIconSolid}
          text="Collectors"
          link="/building-elements/collectors"
          active={router.asPath === "/building-elements/collectors"}
        />
      </ul>
    </nav>
  );
}
