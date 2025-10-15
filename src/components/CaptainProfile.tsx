// pages/profile.js
"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Home,
  CreditCard,
  Wallet,
  ShoppingBag,
  User,
  Globe,
  Moon,
  Lock,
  Clock,
  Edit,
} from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Harsh Mahajan",
    phone: "+91 6267634192",
    servicesDelivered: 259,
    yearsOfExperience: 5,
  });

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Profile | {user.name}</title>
        <meta name="description" content="User profile page" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className="flex flex-col">
        {/* Profile Header */}
        <div className="bg-[#20004F] p-4 opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 opacity-20 bg-[#726686] rounded-full relative">
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Link href="profile/edit">
                  <CiEdit className="text-2xl" />
                </Link>
              </div>
            </div>
            <h1 className="text-white text-xl font-medium mt-2">{user.name}</h1>
            <p className="text-white text-sm mt-1">{user.phone}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6">
          <div className="bg-white ">
            <div className="flex justify-around bg-lightgray p-4">
              <div className="text-center">
                <p className="text-lightpurple font-bold text-2xl">
                  {user.servicesDelivered}+
                </p>
                <p className="text-gray1 text-base">
                  Service
                  <br />
                  Delivered
                </p>
              </div>
              <div className="text-center">
                <p className="text-lightpurple font-bold text-2xl">
                  0{user.yearsOfExperience} +
                </p>
                <p className="text-gray1 text-base">
                  Years of
                  <br />
                  Experience
                </p>
              </div>
            </div>
            {/* Settings */}
            <div className="py-6">
              <div className="p-4 flex items-center border-b border-gray-100 gap-2">
                <Globe size={20} className="text-gray1" />
                <span className="text-black text-lg">App Language</span>
              </div>
              <div className="p-4 flex items-center border-b border-gray-100 gap-2">
                <Moon size={20} className="text-black-600" />
                <span className="text-black text-lg">Set Offline Status</span>
              </div>
              <div className="p-4 flex items-center border-b border-gray-100 gap-2">
                <Lock size={20} className="text-black-600" />
                <span className="text-black text-lg">Change PIN</span>
              </div>
              <div className="p-4 flex items-center border-b border-gray-100 gap-2">
                <Clock size={20} className="text-black-600" />
                <span className="text-black text-lg">Payment History</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-center items-center">
            <button className="text-purple1 text-xl">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
