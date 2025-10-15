// pages/EditProfile.js
"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { IoCameraOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import StateCityDropdown from "./StateCityDropDown";

export default function EditProfile() {
  const router = useRouter();
  function profilePage() {
    router.push("/captain/profile");
  }
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="text-xl" onClick={profilePage}>
          <ArrowLeft />
        </div>
        <div className="h-full w-full flex items-center gap-2">
          <div className="h-8 w-1 rounded-xl bg-[#CABDFF]"></div>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center items-center">
        <div className="h-32 w-32 bg-gray1 opacity-40 rounded-full relative"></div>
        <div className="absolute bg-purple1 h-10 w-10 rounded-full p-2 ">
          <div className="flex justify-center items-center text-white text-2xl font-bold">
            <IoCameraOutline />
          </div>
        </div>
      </div>

      {/* Form for Editing of the Captain */}
      <div>
        <form className="flex flex-col gap-6">
          {/* first name */}
          <div className="h-full w-full flex justify-between items-center bg-slate-100 rounded-xl gap-2 p-2 ">
            <input
              type="text"
              placeholder="Full Name"
              className="bg-slate-100 h-full w-full p-2 tracking-wide text-gray1 text-xl outline-none"
            />
            <FaRegUser />
          </div>

          {/* last name */}
          <div className="h-full w-full flex justify-between items-center bg-slate-100 rounded-xl gap-2 p-2">
            <input
              type="text"
              placeholder="Last Name"
              className="bg-slate-100 h-full w-full p-2 tracking-wide text-gray1 text-xl outline-none"
            />
            <FaRegUser />
          </div>

          {/* email */}

          <div className="h-full w-full flex justify-between items-center bg-slate-100 rounded-xl gap-2 p-2">
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-100 h-full w-full p-2 tracking-wide text-gray1 text-xl outline-none"
            />
            <MdMailOutline />
          </div>

          {/* Phone Number */}

          <div className="h-full w-full flex justify-between items-center bg-slate-100 rounded-xl gap-2 p-2">
            <input
              type="text"
              placeholder="Phone Number"
              className="bg-slate-100 h-full w-full p-2 tracking-wide text-gray1 text-xl outline-none"
            />
            <FiPhone className="text-lg" />
          </div>

          {/* city and state */}
          <div className="">
            <StateCityDropdown />
          </div>

          {/* address */}
          <div className="h-full w-full flex justify-between items-center bg-slate-100 rounded-xl gap-2 p-2">
            <input
              type="text"
              placeholder="Address"
              className="bg-slate-100 h-full w-full p-2 tracking-wide text-gray1 text-xl outline-none"
            />
            <GrLocation className="text-lg" />
          </div>
        </form>
      </div>
    </div>
  );
}
