"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { GrBook } from "react-icons/gr";

interface CaptainHeaderProps {
  captainName?: string;
}

function CaptainHeader({ captainName: propCaptainName }: CaptainHeaderProps) {
  const [captainData, setCaptainData] = useState({
    name: propCaptainName || "",
    availability: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCaptainData() {
      try {
        const response = await fetch("/api/captain");

        if (!response.ok) {
          throw new Error("Failed to fetch captain data");
        }

        const data = await response.json();
        setCaptainData({
          name: data.name,
          availability: data.availability,
        });
      } catch (err) {
        console.error("Error fetching captain data:", err);
        setError("Could not load captain data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCaptainData();
  }, []);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div
          className={`flex justify-center items-center px-4 py-1 rounded-xl gap-1 ${captainData.availability ? "bg-green-100" : "bg-white"}`}
        >
          {captainData.availability ? "Online" : "Offline"}
          <div
            className={`h-3 w-3 rounded-full ${captainData.availability ? "bg-green4" : "bg-gray1"}`}
          ></div>
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="bg-[#FFFFFF] flex justify-center items-center px-4 py-1 rounded-xl gap-1">
            <div>
              <GrBook />
            </div>
            English
          </div>
          <div className="bg-white rounded-full p-2">
            <MdOutlineKeyboardVoice className="text-2xl" />
          </div>
        </div>
      </div>

      {/* <h2 className="mt-4 text-xl font-semibold">
        {isLoading
          ? "Loading..."
          : error
            ? "Welcome Captain"
            : `Welcome Captain, ${captainData.name}👋`}
      </h2> */}
    </div>
  );
}

export default CaptainHeader;
