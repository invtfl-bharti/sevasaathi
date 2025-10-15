"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, addDays, addWeeks, startOfDay } from "date-fns";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import Image from "next/image";
import { Order, OrderStatus } from "@prisma/client";
import { Calendar } from "lucide-react";

// Define types based on your schema
type ServiceWithCategory = {
  id: string;
  name: string;
  imageURL?: string | null;
  serviceCategory: {
    id: string;
    name: string;
    imageURL?: string | null;
  };
};

type OrderWithServices = Order & {
  orderServices: {
    service: ServiceWithCategory;
    units: number;
    cost: number;
  }[];
};

// Time slot options for the service
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
];

const ReschedulePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [order, setOrder] = useState<OrderWithServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Get the next 14 days for date selection
  const nextTwoWeeks = Array.from({ length: 14 }, (_, i) => {
    return addDays(startOfDay(new Date()), i + 1);
  });

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (!orderId || !session?.user.id) return;
        
        const response = await fetch(`/api/order/getOrder?orderId=${orderId}`);
        const data = await response.json();
        
        if (data.success && data.order) {
          setOrder(data.order);
          
          // Set default time from the existing order
          if (data.order.time) {
            setSelectedTime(data.order.time);
          }
          
          // Set default date from the existing order
          if (data.order.date) {
            setSelectedDate(new Date(data.order.date));
          }
        } else {
          setError("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("An error occurred while fetching the order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && session?.user?.id) {
      fetchOrderDetails();
    }
  }, [orderId, session]);

  // Function to handle reschedule submission
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !orderId) {
      setError("Please select both date and time");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch("/api/order/rescheduleOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          date: selectedDate.toISOString(),
          time: selectedTime,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        // Redirect after short delay to allow user to see success message
        setTimeout(() => {
          router.push("/user/bookings");
        }, 2000);
      } else {
        setError(data.message || "Failed to reschedule order");
      }
    } catch (error) {
      console.error("Error rescheduling order:", error);
      setError("An error occurred while rescheduling the order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate reference code from order ID
  const referenceCode = order ? `#D-${order.id.slice(-6)}` : "";

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4 bg-gray-50">
      <HeaderWithBackButton title="Reschedule Booking" />
      
      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : error && !order ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
          <Image 
            src="/icons/error.svg" 
            alt="Error" 
            width={80} 
            height={80} 
            className="mb-4"
          />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Booking Rescheduled!</h3>
          <p className="text-gray-600">Your booking has been successfully rescheduled. Redirecting to bookings...</p>
        </div>
      ) : (
        <>
          {/* Order Summary */}
          {order && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Reschedule Booking</h3>
                  <p className="text-sm text-gray-500">Reference: {referenceCode}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-sm text-gray-600 mb-1">Current Schedule:</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gray-100 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">
                    {order.date ? format(new Date(order.date), "dd MMM, yyyy") : "No date"} at {order.time || "No time"}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">Address:</p>
                <div className="bg-gray-50 p-3 rounded-md text-sm mb-3">
                  {order.address || "No address provided"}
                </div>
              </div>
            </div>
          )}

          {/* Select New Date */}
          <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
            <h3 className="font-medium mb-4">Select New Date</h3>
            
            <div className="flex overflow-x-auto pb-2 gap-2 mb-4">
              {nextTwoWeeks.map((date) => (
                <div 
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg cursor-pointer min-w-16 ${
                    selectedDate && 
                    selectedDate.toDateString() === date.toDateString() 
                      ? "bg-purple-100 border border-purple-300" 
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span className="text-xs text-gray-500">{format(date, "EEE")}</span>
                  <span className="text-lg font-medium">{format(date, "d")}</span>
                  <span className="text-xs text-gray-500">{format(date, "MMM")}</span>
                </div>
              ))}
            </div>
            
            <h3 className="font-medium mb-4">Select New Time</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`flex items-center justify-center py-3 rounded-lg cursor-pointer ${
                    selectedTime === time
                      ? "bg-purple-100 border border-purple-300 text-purple-700"
                      : "bg-gray-50 border border-gray-200 text-gray-700"
                  }`}
                >
                  <span className="text-sm font-medium">{time}</span>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-auto pt-4 flex justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={isSubmitting || !selectedDate || !selectedTime}
              className={`flex-1 py-3 px-4 rounded-md font-medium ${
                isSubmitting || !selectedDate || !selectedTime
                  ? "bg-purple-300 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              }`}
            >
              {isSubmitting ? "Updating..." : "Confirm Reschedule"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReschedulePage;