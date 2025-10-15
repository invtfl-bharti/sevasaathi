"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onClose,
  orderId,
}) => {
  const router = useRouter();
  const [animationState, setAnimationState] = useState<
    "initial" | "circle" | "check" | "text" | "complete"
  >("initial");

  useEffect(() => {
    if (isOpen) {
      // Reset animation state when opening
      setAnimationState("initial");
      
      // Carefully sequenced animations with better timing
      const timers = [
        setTimeout(() => setAnimationState("circle"), 100),
        setTimeout(() => setAnimationState("check"), 1000),
        setTimeout(() => setAnimationState("text"), 1600),
        setTimeout(() => setAnimationState("complete"), 2400),
        
        // Auto-redirect after animations complete
        setTimeout(() => {
          router.push("/user/dashboard");
          onClose();
        }, 4500)
      ];
      
      // Cleanup timers on unmount or when modal closes
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [isOpen, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-10 w-5/6 max-w-md shadow-2xl transform transition-all duration-500 scale-100 opacity-100">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Circle and Checkmark Animation Container */}
          <div className="relative h-28 w-28 mb-8">
            {/* Base circle - always visible */}
            <div className="absolute inset-0 rounded-full bg-green-50"></div>
            
            {/* Animated circle stroke */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  strokeDasharray: 290,
                  strokeDashoffset: animationState === "initial" ? 290 : 0,
                  opacity: animationState === "initial" ? 0 : 1,
                }}
              />
            </svg>
            
            {/* Check container - scales in */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: 1,
                transition: "all 0.5s ease-out",
              }}
            >
              <div 
                className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  transform: animationState === "circle" || animationState === "check" || animationState === "text" || animationState === "complete" 
                    ? "scale(1)" 
                    : "scale(0)",
                  opacity: animationState === "circle" || animationState === "check" || animationState === "text" || animationState === "complete" ? 1 : 0,
                  transitionDelay: "0.8s"
                }}
              >
                {/* Checkmark with drawing animation */}
                <svg 
                  viewBox="0 0 24 24" 
                  width="36" 
                  height="36" 
                  className="text-white"
                  style={{
                    opacity: animationState === "check" || animationState === "text" || animationState === "complete" ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                    transitionDelay: "0.2s"
                  }}
                >
                  <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    style={{
                      strokeDasharray: 30,
                      strokeDashoffset: animationState === "check" || animationState === "text" || animationState === "complete" ? 0 : 30,
                      transition: "stroke-dashoffset 0.6s ease-in-out",
                      transitionDelay: "0.2s"
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Confirmation Text with improved animations */}
          <h3
            className="text-2xl font-bold mb-3 transform transition-all duration-500"
            style={{
              opacity: animationState === "text" || animationState === "complete" ? 1 : 0,
              transform: animationState === "text" || animationState === "complete" ? "translateY(0)" : "translateY(10px)",
            }}
          >
            Booking Confirmed!
          </h3>
          
          <p
            className="text-gray-600 mb-8 transform transition-all duration-500"
            style={{
              opacity: animationState === "text" || animationState === "complete" ? 1 : 0,
              transform: animationState === "text" || animationState === "complete" ? "translateY(0)" : "translateY(10px)",
              transitionDelay: "0.15s"
            }}
          >
            Your service has been scheduled successfully. 
            <span className="block mt-3 text-sm text-gray-500 font-medium">
              Order ID: {orderId.substring(0, 8)}...
            </span>
          </p>

          {/* Button with improved design */}
          <button
            onClick={() => {
              router.push("/user/dashboard");
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg shadow-green-100 transform transition-all duration-500 hover:shadow-green-200 hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            style={{
              opacity: animationState === "complete" ? 1 : 0,
              transform: animationState === "complete" ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;