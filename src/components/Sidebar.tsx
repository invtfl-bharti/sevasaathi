import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { LuWallet } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { TbUsers } from "react-icons/tb";
import { FaPhone } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { useEffect } from "react";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, setIsVisible }) => {

  const [user, setUser] = React.useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    auth().then((data) => {
      console.log("User data for profile : ",data);
      if (data && data.user) {
        setUser({ username: data.user.username, email: data.user.email });
      }
    });
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed h-full w-4/5 top-0 left-0 bg-lightpurple shadow-lg transform
        ${isVisible ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out rounded-r-xl z-50 p-5 text-white`}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <IoCloseSharp
            className="text-4xl cursor-pointer"
            onClick={() => setIsVisible(false)}
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 mt-4">
          <div className="rounded-full h-16 w-16 border-2 border-white bg-gray-300">
            <Image
              src={"/default-avatar.png"}
              alt="User Avatar"
              objectFit="cover"
              height={80}
              width={80}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user?.username || "Guest"} </h3>
            <p className="text-sm text-lightgray">{user?.email || "No email available"}</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col py-14 gap-12 font-semibold text-xl tracking-wide ">
          <div className="flex gap-2 text-xl">
            <LuWallet className="text-2xl text-lightgray" /> Payments
          </div>
          <div className=" flex gap-2">
            <GrLocation className="text-2xl text-lightgray" />
            Address
          </div>
          <div className="flex gap-2">
            <MdOutlineNotificationsNone className="text-2xl text-lightgray" />
            Notifications
          </div>
          <div className=" flex gap-2">
            <BiSolidOffer className="text-2xl text-lightgray" />
            Offers
          </div>
          <div className="flex gap-2">
            <TbUsers className="text-2xl text-lightgray" />
            About Us
          </div>
          <div className="flex gap-2 ">
            <FaPhone className="text-2xl text-lightgray" />
            Contact
          </div>
        </div>

        {/* Logout */}
        <div className="mt-[40%] ">
          <button className=" text-white py-2 px-4 rounded-md w-full font-semibold text-xl tracking-wide flex gap-2 ">
            <MdLogout className="text-2xl" />
            Logout
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsVisible(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
// Removed the conflicting local declaration of useEffect

