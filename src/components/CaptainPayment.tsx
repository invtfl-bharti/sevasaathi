import React from "react";
import HeaderWithBackButton from "./HeaderWithBackButton";

interface Props {
  title: string;
}

const CaptainPayment: React.FC<Props> = ({ title }) => {
  return (
    <div className="px-4 py-2">
      <div className="">
        <HeaderWithBackButton title="Payment History" />
      </div>

      <div className="flex justify-center items-center flex-col gap-2 border-b-2 border-gray-300 p-4">
        <h2 className="font-bold text-2xl">₹420</h2>
        <p className="text-gray-500">Total Earnings</p>
      </div>

      <div className="flex justify-between items-center px-4 py-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-xl">14 February 2025</h2>
          <p className="text-base text-gray-500">Pipe Cleaning</p>
        </div>

        <h2 className="text-2xl text-green4 font-semibold">+₹420</h2>
      </div>
    </div>
  );
};

export default CaptainPayment;
