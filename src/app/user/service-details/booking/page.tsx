import React from "react";
import Image from "next/image";
import Link from "next/link";

function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <Image src="/Icon/Check.png" alt="Check Image" height={80} width={80} />

        <p className="text-[#52B46B] font-bold text-2xl">Booking Successful !</p>
        <p className="text-gray text-center px-6">
          Your request has successfully been received by the admins for booking of{" "}
          <span className="text-black font-semibold">AC Check-Up</span> for the
          upcoming date <span className="text-black font-semibold">26 Apr</span>. 
          Our service provider will contact you soon.
        </p>
      </div>

      {/* Button at Bottom */}
      <div className="p-6">
        <Link href="/user/dashboard/bookings">
          <button className="w-full py-2 bg-lightpurple rounded-xl text-white text-xl">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Page;

