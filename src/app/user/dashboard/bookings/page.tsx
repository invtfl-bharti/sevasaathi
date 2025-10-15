"use client";
import ButtonNavigation from "@/components/ButtonNavigation";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { format } from "date-fns";
import { Order, OrderStatus, Service } from "@prisma/client";

// Define types based on your schema
type ServiceWithCategory = Service & {
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

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState<"Upcoming" | "History">("Upcoming");
  const [bookings, setBookings] = useState<OrderWithServices[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        if (!session?.user.id) return;
        
        const response = await fetch(`/api/user/fetchOrder?userId=${session.user.id}`);
        const data = await response.json();
        
        if (data.success) {
          setBookings(data.orders);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchBookings();
    }
  }, [session]);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "Upcoming") {
      return ["PENDING", "BOOKED"].includes(booking.status);
    } else {
      return ["COMPLETED", "CANCELLED"].includes(booking.status);
    }
  });

  const handleReschedule = (bookingId: string) => {
    // Handle reschedule functionality
    console.log("Reschedule booking:", bookingId);
    // Could redirect to a reschedule page or open a modal
    window.location.href = `/user/dashboard/reschedule?orderId=${bookingId}`;
  };

  return (
    <div className="h-full w-full flex flex-col justify-between gap-4 p-4 bg-gray-50">
      <HeaderWithBackButton title="Bookings" />
      
      <div className="h-12 w-full flex gap-4 justify-around items-center bg-white rounded-lg shadow-sm">
        <div 
          className={`flex justify-center items-center cursor-pointer transition-all py-2 px-8 rounded-full ${activeTab === "Upcoming" ? "text-purple-600 bg-purple-100 font-medium" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("Upcoming")}
        >
          <h4>Upcoming</h4>
        </div>
        <div 
          className={`flex justify-center items-center cursor-pointer transition-all py-2 px-8 rounded-full ${activeTab === "History" ? "text-purple-600 bg-purple-100 font-medium" : "text-gray-500 hover:bg-gray-100"}`}
          onClick={() => setActiveTab("History")}
        >
          <h4>History</h4>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onReschedule={handleReschedule} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-40 mt-8">
            <Image 
              src="/icons/no-bookings.svg" 
              alt="No bookings" 
              width={80} 
              height={80}
              className="mb-4 opacity-70"
            />
            <p className="text-gray-500 font-medium">No {activeTab.toLowerCase()} bookings found</p>
            <p className="text-gray-400 text-sm mt-1">Book a service to see it here</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 h-16 w-full">
        <ButtonNavigation />
      </div>
    </div>
  );
};

// Booking Card Component
interface BookingCardProps {
  booking: OrderWithServices;
  onReschedule: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onReschedule }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Group services by category
  const servicesByCategory = booking.orderServices.reduce((acc, orderService) => {
    const category = orderService.service.serviceCategory;
    const categoryName = category.name;
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        categoryId: category.id,
        categoryName,
        categoryImage: category.imageURL || "/icons/service-default.svg",
        services: []
      };
    }
    
    acc[categoryName].services.push({
      id: orderService.service.id,
      name: orderService.service.name,
      units: orderService.units,
      cost: orderService.cost,
      imageURL: orderService.service.imageURL
    });
    
    return acc;
  }, {} as Record<string, {
    categoryId: string;
    categoryName: string;
    categoryImage: string;
    services: {
      id: string;
      name: string;
      units: number;
      cost: number;
      imageURL?: string | null;
    }[];
  }>);
  
  // Convert to array for easier rendering
  const categoriesArray = Object.values(servicesByCategory);
  
  // Format date for display
  const formattedTime = booking.time || "";
  const formattedDate = booking.date ? 
    format(new Date(booking.date), "dd MMM, yyyy") : 
    "No date scheduled";
  
  // Calculate total cost
  const totalCost = booking.orderServices.reduce(
    (sum, orderService) => sum + orderService.cost, 
    0
  );
  
  // Get appropriate status label and color
  const getStatusDetails = (status: OrderStatus) => {
    const statusMap = {
      "PENDING": { label: "Pending", bgColor: "bg-amber-100", textColor: "text-amber-600" },
      "BOOKED": { label: "Confirmed", bgColor: "bg-green-100", textColor: "text-green-600" },
      "CANCELLED": { label: "Cancelled", bgColor: "bg-red-100", textColor: "text-red-600" },
      "COMPLETED": { label: "Completed", bgColor: "bg-blue-100", textColor: "text-blue-600" }
    };
    
    return statusMap[status] || { label: status, bgColor: "bg-gray-100", textColor: "text-gray-600" };
  };
  
  const statusDetails = getStatusDetails(booking.status);

  // Generate reference code from booking ID
  const referenceCode = `#D-${booking.id.slice(-6)}`;

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
      {/* Header with first category and reference */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-orange-100 rounded-full p-0 w-16 h-16 relative overflow-hidden">
          <div className="w-full h-full relative">
            <Image 
              src={categoriesArray[0]?.categoryImage || "/icons/service-default.svg"} 
              alt={categoriesArray[0]?.categoryName || "Service"} 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{categoriesArray[0]?.categoryName || "Service"}</h3>
          <p className="text-gray-500 text-sm">Reference: {referenceCode}</p>
        </div>
        <div 
          className={`px-3 py-1 rounded-full ${statusDetails.bgColor} ${statusDetails.textColor} text-xs font-medium`}
        >
          {statusDetails.label}
        </div>
      </div>
      
      {/* Schedule information */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-medium">{formattedTime}</div>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>
      </div>
      
      {/* Services summary (collapsed view) */}
      {!expanded && (
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {booking.orderServices.length} service{booking.orderServices.length !== 1 ? 's' : ''} selected
            </div>
            <div className="font-medium text-green-600">₹{totalCost.toFixed(2)}</div>
          </div>
        </div>
      )}
      
      {/* Expanded view with all services by category */}
      {expanded && (
        <div className="mb-4 space-y-4">
          {categoriesArray.map((category) => (
            <div key={category.categoryId} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 flex items-center gap-2">
                <div className="w-6 h-6 relative">
                  <Image 
                    src={category.categoryImage} 
                    alt={category.categoryName} 
                    fill
                    sizes="24px"
                    className="object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                </div>
                <h4 className="font-medium text-sm">{category.categoryName}</h4>
              </div>
              
              <div className="divide-y divide-gray-100">
                {category.services.map((service) => (
                  <div key={service.id} className="px-3 py-2 flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">Qty: {service.units}</p>
                    </div>
                    <p className="text-sm font-medium">₹{service.cost.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="font-medium">Total</div>
            <div className="font-bold text-green-600">₹{totalCost.toFixed(2)}</div>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-purple-600 text-sm font-medium flex items-center"
        >
          {expanded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide Details
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              View Details
            </>
          )}
        </button>
        
        {["PENDING", "BOOKED"].includes(booking.status) && (
          <button 
            onClick={() => onReschedule(booking.id)}
            className="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;