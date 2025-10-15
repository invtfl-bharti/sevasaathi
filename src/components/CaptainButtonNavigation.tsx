"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRef } from "react";
import { TbHome, TbHomeFilled } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { HiOutlineTicket } from "react-icons/hi";
import { LuShoppingBag } from "react-icons/lu";

import {
  MdChat,
  MdOutlineChat,
  MdMarkUnreadChatAlt,
  MdOutlineMarkUnreadChatAlt,
} from "react-icons/md";
import { FaRegCircleUser, FaCircleUser } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import Link from "next/link";

const CaptainButtonNavigation = () => {
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

      <Link href="/captain/dashboard">
        <button className="h-full w-full flex justify-center items-center">
          {/* <TbHome className="text-gray-400 text-3xl" /> */}
          <TbHomeFilled className="text-gray1 text-3xl hover:text-lightpurple transition duration-300" />
        </button>
      </Link>

      {/* Ticket section */}
      <Link href="">
        <button className="h-full w-full flex justify-center items-center">
          {/* <TbHome className="text-gray-400 text-3xl" /> */}
          <HiOutlineTicket className="text-gray1 text-3xl hover:text-lightpurple transition duration-300" />
        </button>
      </Link>

      {/* Payment section */}

      <Link href="/captain/payment/payment-history">
        <button className="h-full w-full flex justify-center items-center">
          <LuWallet className="text-gray1 text-3xl  hover:text-lightpurple transition duration-300" />
          {/* <RiFileList3Fill className="text-lightpurple text-3xl" />  */}
        </button>
      </Link>

      {/* Notification section */}
      <Link href="/captain/shop">
        <button className="h-full w-full flex justify-center items-center">
          <LuShoppingBag className="text-gray1 text-3xl " />
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
      <Link href="/captain/profile">
        <button className="h-full w-full flex justify-center items-center">
          <FaRegCircleUser className="text-gray1 text-3xl" />
          {/* <FaCircleUser className="text-lightpurple text-3xl" /> */}
        </button>
      </Link>
    </div>
  );
};

export default CaptainButtonNavigation;
