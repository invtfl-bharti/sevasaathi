"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRef } from "react";
import { TbHome, TbHomeFilled } from "react-icons/tb";
import { RiFileList3Fill, RiFileList3Line } from "react-icons/ri";
import { VscBell, VscBellDot } from "react-icons/vsc";
import {
  MdChat,
  MdOutlineChat,
  MdMarkUnreadChatAlt,
  MdOutlineMarkUnreadChatAlt,
} from "react-icons/md";
import { FaRegCircleUser, FaCircleUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import Link from "next/link";

const ButtonNavigation = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const navRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      lastScrollY.current = window.scrollY;
    }

    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={navRef}
      className={`h-full w-full flex justify-evenly items-center bg-white transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Home section */}

      <Link href="/user/dashboard">

        <button className="h-full w-full flex justify-center items-center">
          {/* <TbHome className="text-gray-400 text-3xl" /> */}
          <TbHomeFilled className="text-lightpurple text-3xl" />
        </button>
      </Link>

      {/* Service section */}

      <Link href="/user/dashboard/bookings">
      <button className="h-full w-full flex justify-center items-center">
        <RiFileList3Line className="text-gray-400 text-3xl" />
        {/* <RiFileList3Fill className="text-lightpurple text-3xl" />  */}
      </button>
      </Link>

      {/* Notification section */}
      <Link href="/user/dashboard/notifications">
      <button className="h-full w-full flex justify-center items-center">
        <VscBell className="text-gray-400 text-3xl" />
        {/* <VscBellDot className="text-lightpurple text-3xl"/> */}
      </button>
      </Link>

      {/* Message section */}

      {/* <button className="h-full w-full flex justify-center items-center">
      <MdOutlineChat />
      <MdChat />
      <MdMarkUnreadChatAlt />
      <MdOutlineMarkUnreadChatAlt />
      </button> */}

      {/* User section */}
      <Link href="/user/dashboard/profile">
      <button className="h-full w-full flex justify-center items-center">
        <FaRegCircleUser className="text-gray-400 text-3xl" />
        {/* <FaCircleUser className="text-lightpurple text-3xl" /> */}
      </button>
      </Link>
    </div>
  );
};

export default ButtonNavigation;
