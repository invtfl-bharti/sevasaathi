"use client";
import React, { useState } from "react";
import InfoScreen from "@/components/InfoScreenProps";
import HomePage from "@/components/HomePage";

function Page() {
  const [currentPage, setCurrentPage] = useState("onboarding");

  const handleGetStarted = () => {
    setCurrentPage("findService");
  };

  const handleSkip = () => {
    // Navigate based on current page
    if (currentPage === "findService") {
      setCurrentPage("bookAppointment");
    } else if (currentPage === "bookAppointment") {
      setCurrentPage("paymentGateway");
    } else if (currentPage === "paymentGateway") {
      setCurrentPage("home");
    }
  };

  // Handle navigation to next page
  const handleNext = () => {
    if (currentPage === "onboarding") {
      setCurrentPage("findService");
    } else if (currentPage === "findService") {
      setCurrentPage("bookAppointment");
    } else if (currentPage === "bookAppointment") {
      setCurrentPage("paymentGateway");
    } else if (currentPage === "paymentGateway") {
      setCurrentPage("home");
    }
  };

  // Function to handle the text button click
  const handleTextButtonClick = () => {
    if (currentPage === "onboarding") {
      handleGetStarted();
    } else if (currentPage !== "home") {
      handleSkip();
    }
  };

  // Check if we're on the homepage
  const isHomePage = currentPage === "home";

  // Get content for each screen
  // Get content for each screen
const getScreenContent = () => {
  switch (currentPage) {
    case "onboarding":
      return {
        imgUrl: "/Icon/HomePage.png",
        imgHeight: 400,
        imgWidth: 400,
        title: "Welcome To SevaSathi",
        subtitle: "Your one stop destination for all your daily chores!",
      };
    case "findService":
      return {
        imgUrl: "/Icon/Page2.png",
        imgHeight: 400,
        imgWidth: 400,
        title: "Find Your Service",
        subtitle: "Find your service as per your preferences",
      };
    case "bookAppointment":
      return {
        imgUrl: "/Icon/Page3.png",
        imgHeight: 400,
        imgWidth: 400,
        title: "Book Your Appointment",
        subtitle: "Schedule services at your convenience with just a few taps",
      };
    case "paymentGateway":
      return {
        imgUrl: "/Icon/Page4.png",
        imgHeight: 400,
        imgWidth: 400,
        title: "Easy Payments",
        subtitle: "Secure and hassle-free payment options for all services",
      };
    default:
      return {
        imgUrl: "",
        imgHeight: 400,
        imgWidth: 400,
        title: "",
        subtitle: "",
      };
  }
};

  return (
    <div className="h-full w-full">
      <div className="h-screen w-full overflow-hidden bg-white relative">
        {/* SVG Background - Only show when not on homepage */}
        {!isHomePage && (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 375 812"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 right-0 z-0"
          >
            {/* Large purple circle in top right */}
            <circle cx="490" cy="180" r="420" fill="#d9c6ff" />
            {/* Progress dots at bottom */}
            <g transform="translate(32, 760)">
              {/* Dots change based on current page */}
              {currentPage === "onboarding" ? (
                <>
                  <rect
                    x="0"
                    y="0"
                    width="20"
                    height="8"
                    rx="4"
                    fill="#7b52ff"
                  />
                  <circle cx="36" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="52" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="68" cy="4" r="4" fill="#d9d9d9" />
                </>
              ) : currentPage === "findService" ? (
                <>
                  <circle cx="4" cy="4" r="4" fill="#d9d9d9" />
                  <rect
                    x="20"
                    y="0"
                    width="20"
                    height="8"
                    rx="4"
                    fill="#7b52ff"
                  />
                  <circle cx="52" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="68" cy="4" r="4" fill="#d9d9d9" />
                </>
              ) : currentPage === "bookAppointment" ? (
                <>
                  <circle cx="4" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="20" cy="4" r="4" fill="#d9d9d9" />
                  <rect
                    x="36"
                    y="0"
                    width="20"
                    height="8"
                    rx="4"
                    fill="#7b52ff"
                  />
                  <circle cx="68" cy="4" r="4" fill="#d9d9d9" />
                </>
              ) : currentPage === "paymentGateway" ? (
                // For payment gateway page
                <>
                  <circle cx="4" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="20" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="36" cy="4" r="4" fill="#d9d9d9" />
                  <rect
                    x="52"
                    y="0"
                    width="20"
                    height="8"
                    rx="4"
                    fill="#7b52ff"
                  />
                </>
              ) : (
                <>
                  <circle cx="4" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="20" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="36" cy="4" r="4" fill="#d9d9d9" />
                  <circle cx="52" cy="4" r="4" fill="#d9d9d9" />
                </>
              )}
            </g>

            {/* Button text at bottom */}
            <text
              x="325"
              y="764"
              fontFamily="Arial, sans-serif"
              fontSize="20"
              fontWeight="bold"
              textAnchor="end"
              fill="#7b52ff"
              style={{ cursor: "pointer" }}
              onClick={handleTextButtonClick}
            >
              {currentPage === "onboarding" ? "Get Started" : "Skip"}
            </text>
          </svg>
        )}

        {/* Component rendering based on current page */}
        {isHomePage ? (
          // For HomePage, render with full screen and no extra styling
          <div className="w-full h-full">
            <HomePage />
          </div>
        ) : (
          // For onboarding screens, keep original styling
          <div className="absolute z-10 p-6 inset-2 flex items-center justify-center my-[40%]">
            {currentPage !== "home" && (
              <div
                onClick={
                  currentPage === "onboarding" ? handleGetStarted : handleNext
                }
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                <InfoScreen {...getScreenContent()} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
