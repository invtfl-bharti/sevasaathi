"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Calendar,
  User,
  ShoppingBag,
  Home,
  AlignLeft,
  Wallet,
  Package,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CaptainButtonNavigation from "./CaptainButtonNavigation";

export default function CaptainDashboard({
  captainData = {
    user: {
      id: "",
      username: "Harsh",
      imageURL: null,
      rating: 4.5,
    },
    id: "",
    hourlyRate: 0,
    availability: false, // Set to false to show "Offline"
    experience: 0,
    location: "",
    totalEarning: 6969,
    totalServices: 420,
    upcomingBookings: 15,
    todayBookings: 5,
    weeklyRevenue: [
      { day: "Mon", value: 500 },
      { day: "Tue", value: 1000 },
      { day: "Wed", value: 0 },
      { day: "Thu", value: 0 },
      { day: "Fri", value: 0 },
      { day: "Sat", value: 0 },
      { day: "Sun", value: 0 },
    ],
    reviews: [
      {
        id: "1",
        user: { username: "Yuvraj Singh" },
        rating: 4.5,
        review: "Handsome guy",
        createdAt: new Date("2023-12-02"),
      },
      {
        id: "2",
        user: { username: "Srijan" },
        rating: 4.5,
        review: "Hehehe",
        createdAt: new Date("2024-01-30"),
      },
      {
        id: "3",
        user: { username: "Kuch Naam" },
        rating: 4.5,
        review: "Hohoho",
        createdAt: new Date("2024-02-02"),
      },
    ],
  },
}) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const day = d.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day < 10 ? "0" + day : day} ${monthNames[d.getMonth()]}`;
  };

  const handleNavigateToServices = () => {
    if (isMounted) {
      router.push("/captain/services");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="h-full w-full ">
      {/* Greeting */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Hello Harsh <span className="text-yellow-500">👋</span>
          </h1>
          <p className="text-gray-500">Welcome Back!</p>
        </div>
        {/* Main Stats - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Earning */}
          <div className="bg-[#FFD88D] rounded-lg flex flex-col justify-center items-center">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ₹{captainData.totalEarning}
                </div>

                <div className="text-gray1 text-sm">Total Earning</div>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <BarChart size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
          {/* Services */}
          <div className="bg-[#CBEBA4] rounded-lg p-4" onClick={() => router.push("/captain/services")}>
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {captainData.totalServices}
                </div>
                <div className="text-gray-600 text-sm">Services</div>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <AlignLeft size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
          {/* Upcoming Services */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-500">
                  {captainData.upcomingBookings}
                </div>
                <div className="text-gray-600 text-sm">
                  Upcoming
                  <br />
                  Services
                </div>
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Calendar size={16} className="text-indigo-500" />
              </div>
            </div>
          </div>
          {/* Today's Service */}
          <div className="bg-white rounded-lg p-4 justify-center items-center">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-500">
                  {String(captainData.todayBookings).padStart(2, "0")}
                </div>
                <div className="text-gray-600 text-sm">
                  Today's
                  <br />
                  Service
                </div>
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Calendar size={16} className="text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
        {/* Weekly Revenue Chart */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Revenue</h2>

          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>1500</span>
              <span>1000</span>
              <span>500</span>
              <span>0</span>
            </div>

            {/* Chart grid */}
            <div className="ml-8 h-full flex flex-col justify-between">
              <div className="w-full h-px bg-gray-200"></div>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="w-full h-px bg-gray-200"></div>
            </div>

            {/* Bar chart */}
            <div className="absolute left-8 bottom-0 right-0 top-0 flex items-end">
              <div className="flex justify-between items-end w-full h-36">
                {" "}
                {/* Chart height */}
                {captainData.weeklyRevenue.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end h-full flex-1"
                  >
                    <div
                      className={`w-6 ${item.value > 0 ? "bg-indigo-500" : "bg-transparent"} rounded-t`}
                      style={{
                        height: `${Math.min(100, (item.value / 1500) * 100)}%`,
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{item.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Reviews */}
        <div className="mb-4 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <span className="text-indigo-500 text-lg">View All</span>
          </div>

          {captainData.reviews.map((review, index) => (
            <div key={review.id} className="bg-lightgray rounded-lg p-4 mb-2">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">{review.user.username}</h3>
                <span className="text-gray-800 text-sm">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <div className="flex items-center mb-1">
                <div className="flex text-yellow-400">
                  {"★★★★★".split("").map((star, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(review.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-1 text-sm">{review.rating}</span>
              </div>

              <p className="text-gray-800">{review.review}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center p-3">
        <CaptainButtonNavigation />
        {/* <div className="flex flex-col items-center text-indigo-500">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Calendar size={20} />
          <span className="text-xs mt-1">Calendar</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Wallet size={20} />
          <span className="text-xs mt-1">Wallet</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Package size={20} />
          <span className="text-xs mt-1">Orders</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div> */}
      </div>
    </div>
  );
}
