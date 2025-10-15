import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import "../login/page";
import { Inter } from "next/font/google";
import SearchBar from "@/components/SearchBar";
import "@/styles/hideScrollbar.css";
import ItemCard from "@/components/ItemCard";
import ServiceCategoryList from "@/components/ServiceCategoryList";
import ButtonNavigation from "@/components/ButtonNavigation";
import DashboardFooter from "@/components/DashboardFooter";
import MostBookedServices from "@/components/MostBookedServices";
import CaptainTrackingClient from "@/components/CaptainTrackingClient";
import CaptainLocationTracker from "@/components/CaptainLocationTracker";
import TripDetailsPage from "@/components/TripDetailsPage";
import TripLocationMap from "@/components/TripLocationMap";
import TopRatedPartners from "@/components/TopPartners";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const page = () => {
  const searchPlaceholder = "Search what you need...";

  return (
    <div className={`${inter.variable} font-sans bg-[#F5F5F5] h-screen`}>

      <div className="bg-gray-100 w-full flex flex-col justify-between gap-2">
        <div className="bg-white px-6 flex flex-col justify-between py-4 gap-2 h-full w-full rounded-b-lg">
          <DashboardHeader />
          <header className="mt-4 flex flex-col justify-between gap-2">
            <h2 className="text-[#666C89] font-sans">HELLO 👋</h2>
            <h2 className="text-2xl font-bold text-dashboardfontcolor tracking-wide">
              What are you looking for today?
            </h2>
          </header>
          <SearchBar searchPlaceholder={searchPlaceholder} />
        </div>

        <ServiceCategoryList />

        <div className="h-full w-full py-4 px-6 rounded-lg bg-white">

        <MostBookedServices/>
          
        </div>

        <div className="h-full w-full py-4 px-6 rounded-lg bg-white">
          <TopRatedPartners/>
        </div>

        <div className="h-96 w-full flex flex-col justify-center items-center">
          <p>Testing MAP SERVICES Below :</p> 

          <p className="text-center text-2xl font-bold text-red-600">TESTING PAHSE</p>
        </div>
 
        <CaptainTrackingClient tripId="trip1" userId="2ef8d520-6275-4459-9447-325d154b3ba4"></CaptainTrackingClient>
        <CaptainLocationTracker tripId="trip1"></CaptainLocationTracker>

        <TripDetailsPage params={{ id: "trip1" }}></TripDetailsPage>
        <TripLocationMap tripId="trip1"></TripLocationMap>

        <div className="bg-[#B6B6D6]">
          {/* logo */}
          <div>
            <img src="/Icon/download_logo.png" alt="" />
          </div>

          {/* description */}
          <div></div>

          {/* For Partners */}

          <div></div>

          {/* company */}
          <div></div>

          {/* legal */}

          <div></div>
        </div>

        <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-10">
          <ButtonNavigation />
        </div>

        <div>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default page;
