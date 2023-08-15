"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { adminRoutes } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const pathName = usePathname();

  const activeRoute = adminRoutes.find((route) => route.path === pathName);

  const windowResize = () => {
    if (window.innerWidth > 768) {
      setIsHeaderOpen(true);
    } else {
      setIsHeaderOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", windowResize);
    return () => {
      window.removeEventListener("resize", windowResize);
    };
  }, []);

  return (
    <>
      <nav
        className={`absolute top-0 left-0 h-screen overflow-y-auto bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900 transition-all duration-300  z-40 ${
          isHeaderOpen ? "w-screen md:w-[300px] lg:w-[400px]" : "!w-0"
        }`}
      >
        <div className="flex items-center justify-between w-full h-20 px-4 shadow-md dark:shadow-gray-950 bg-inherit">
          <div className="flex flex-row gap-3">
            <h1 className="text-lg lg:text-2xl">Question Paper Creation</h1>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            {isHeaderOpen && (
              <Button
                variant={"outline"}
                size={"icon"}
                className="md:hidden"
                onClick={() => setIsHeaderOpen(false)}
              >
                <XIcon size={24} />
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {adminRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center gap-3 px-2 py-4 transition-all rounded-md ${
                activeRoute?.path === route.path
                  ? "bg-gray-100 dark:bg-gray-800"
                  : ""
              }`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsHeaderOpen(false);
                }
              }}
            >
              {<route.icon size={24} />}
              <p className="font-SpaceGrotesk">{route.name}</p>
            </Link>
          ))}
        </div>
      </nav>
      <Button
        variant={"outline"}
        size={"icon"}
        className={`fixed top-4 right-4 z-50 ${
          isHeaderOpen ? "hidden" : "flex"
        }`}
        onClick={() => setIsHeaderOpen(true)}
      >
        <MenuIcon size={24} />
      </Button>
    </>
  );
};

export default Sidebar;
