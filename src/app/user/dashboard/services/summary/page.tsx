// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { format } from "date-fns";
// import HeaderWithBackButton from "@/components/HeaderWithBackButton";
// import ButtonNavigation from "@/components/ButtonNavigation";
// import toast from "react-hot-toast";

// interface SelectedService {
//   id: string;
//   name: string;
//   unitCount: number;
//   pricePerUnit: number;
// }

// interface AddressDetails {
//   id?: string;
//   name: string;
//   address: string;
//   isDefault?: boolean;
//   isNew?: boolean;
//   isCurrent?: boolean;
// }

// interface BookingData {
//   services: SelectedService[];
//   totalAmount: number;
//   dateTime: string;
//   description: string;
//   address: AddressDetails;
// }

// const ServiceSummary = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dataParam = searchParams.get("data");
//   const [bookingData, setBookingData] = useState<BookingData | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userId, setUserId] = useState<string>("");
//   const [editMode, setEditMode] = useState({
//     dateTime: false,
//     address: false,
//   });
//   const [editedAddress, setEditedAddress] = useState<string>("");
//   const [editedDateTime, setEditedDateTime] = useState<Date | null>(null);
  
//   // Available time slots for editing
//   const timeSlots = [
//     "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
//     "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
//   ];

//   useEffect(() => {
//     // Parse booking data from URL params
//     if (dataParam) {
//       try {
//         const parsedData = JSON.parse(decodeURIComponent(dataParam));
//         setBookingData(parsedData);
        
//         if (parsedData.address) {
//           setEditedAddress(parsedData.address.address);
//         }
        
//         if (parsedData.dateTime) {
//           setEditedDateTime(new Date(parsedData.dateTime));
//         }
//       } catch (error) {
//         console.error("Error parsing booking data:", error);
//         toast.error("Invalid booking data");
//         router.push("/dashboard/services");
//       }
//     } else {
//       toast.error("No booking data found");
//       router.push("/dashboard/services");
//     }

//     // Fetch current user ID
//     fetchUserId();
//   }, [dataParam, router]);

//   const fetchUserId = async () => {
//     try {
//       const response = await fetch("/api/user/profile");
//       if (response.ok) {
//         const data = await response.json();
//         setUserId(data.user.id);
//       } else {
//         toast.error("Failed to fetch user profile");
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   const handleEditField = (field: keyof typeof editMode) => {
//     setEditMode((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   const handleUpdateDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEditedDateTime(new Date(e.target.value));
//   };

//   const handleUpdateAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setEditedAddress(e.target.value);
//   };

//   const handleUpdateTime = (time: string) => {
//     if (!editedDateTime) return;
    
//     const [hourStr, minuteStr] = time.split(':');
//     const [period] = time.split(' ')[1];
    
//     let hour = parseInt(hourStr);
//     const minute = parseInt(minuteStr);
    
//     // Convert to 24-hour format
//     if (period === 'PM' && hour < 12) {
//       hour += 12;
//     } else if (period === 'AM' && hour === 12) {
//       hour = 0;
//     }
    
//     const newDateTime = new Date(editedDateTime);
//     newDateTime.setHours(hour);
//     newDateTime.setMinutes(minute);
    
//     setEditedDateTime(newDateTime);
    
//     setEditMode((prev) => ({
//       ...prev,
//       dateTime: false,
//     }));
//   };

//   const handleScheduleService = async () => {
//     if (!bookingData || !userId) {
//       toast.error("Missing booking data or user ID");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Prepare services data for API
//       const servicesData = bookingData.services.map(service => ({
//         id: service.id,
//         name: service.name,
//         units: service.unitCount,
//         cost: service.pricePerUnit * service.unitCount
//       }));

//       // Get address ID if using existing address
//       let addressId = null;
//       if (bookingData.address && !bookingData.address.isNew && !bookingData.address.isCurrent) {
//         addressId = bookingData.address.id || null;
//       }

//       // Create order request
//       const response = await fetch("/api/user/order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: userId,
//           address: editedAddress || bookingData.address.address,
//           addressId: addressId,
//           date: editedDateTime ? editedDateTime.toISOString() : bookingData.dateTime,
//           time: editedDateTime ? format(editedDateTime, "hh:mm a") : format(new Date(bookingData.dateTime), "hh:mm a"),
//           services: servicesData,
//           description: bookingData.description,
//           status: "PENDING"
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         toast.success("Service scheduled successfully!");
//         // Redirect to order confirmation page
//         // router.push(`/user/dashboard/orders/${data.order.id}`);
//         router.push(`/user/dashboard`);
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to schedule service");
//       }
//     } catch (error) {
//       console.error("Error scheduling service:", error);
//       toast.error("An error occurred while scheduling your service");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!bookingData) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <HeaderWithBackButton title="Service Summary" />
//         <div className="mt-10 flex justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple1"></div>
//         </div>
//       </div>
//     );
//   }

//   const formattedDateTime = editedDateTime 
//     ? format(editedDateTime, "MMMM d, yyyy 'at' h:mm aa") 
//     : format(new Date(bookingData.dateTime), "MMMM d, yyyy 'at' h:mm aa");

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">
//       <div className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="p-4">
//           <HeaderWithBackButton title="Service Summary" />
//         </div>
//       </div>

//       <div className="p-4 space-y-6">
//         {/* Service Details */}
//         <div className="bg-white p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold text-lg mb-4">Service Details</h3>
          
//           {/* Date & Time */}
//           <div className="mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <p className="text-gray-600">Date & Time</p>
//               <button
//                 onClick={() => handleEditField('dateTime')}
//                 className="text-purple1 text-sm"
//               >
//                 {editMode.dateTime ? "Save" : "Edit"}
//               </button>
//             </div>
            
//             {editMode.dateTime ? (
//               <div className="space-y-3">
//                 <input
//                   type="datetime-local"
//                   value={editedDateTime ? format(editedDateTime, "yyyy-MM-dd'T'HH:mm") : ''}
//                   onChange={handleUpdateDateTime}
//                   min={new Date().toISOString().split('.')[0]}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 />
//                 <div className="mt-2">
//                   <p className="text-sm font-medium text-gray-700 mb-1">Quick Select Time</p>
//                   <div className="grid grid-cols-3 gap-2">
//                     {timeSlots.map((time) => (
//                       <div
//                         key={time}
//                         onClick={() => handleUpdateTime(time)}
//                         className="p-2 text-center border rounded-lg cursor-pointer text-sm border-gray-300 hover:bg-purple1 hover:text-white hover:border-purple1"
//                       >
//                         {time}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <p className="font-medium">{formattedDateTime}</p>
//             )}
//           </div>
          
//           {/* Address */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <p className="text-gray-600">Address</p>
//               <button
//                 onClick={() => handleEditField('address')}
//                 className="text-purple1 text-sm"
//               >
//                 {editMode.address ? "Save" : "Edit"}
//               </button>
//             </div>
            
//             {editMode.address ? (
//               <textarea
//                 value={editedAddress}
//                 onChange={handleUpdateAddress}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 rows={3}
//               />
//             ) : (
//               <p className="font-medium">{editedAddress || bookingData.address.address}</p>
//             )}
//           </div>
//         </div>

//         {/* Selected Services */}
//         <div className="bg-white p-4 rounded-xl shadow-sm">
//           <h3 className="font-semibold text-lg mb-4">Selected Services</h3>
          
//           <div className="space-y-3 mb-4">
//             {bookingData.services.map((service) => (
//               <div key={service.id} className="flex justify-between p-3 border border-gray-200 rounded-lg">
//                 <div>
//                   <p className="font-medium">{service.name}</p>
//                   <p className="text-sm text-gray-600">₹{service.pricePerUnit.toFixed(2)} × {service.unitCount}</p>
//                 </div>
//                 <p className="font-semibold">₹{(service.pricePerUnit * service.unitCount).toFixed(2)}</p>
//               </div>
//             ))}
//           </div>
          
//           <div className="border-t border-gray-200 pt-3 flex justify-between">
//             <p className="font-medium">Total</p>
//             <p className="font-bold text-green4">₹{bookingData.totalAmount.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* Additional Information */}
//         {bookingData.description && (
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <h3 className="font-semibold text-lg mb-3">Additional Details</h3>
//             <p className="text-gray-700">{bookingData.description}</p>
//           </div>
//         )}

//         <button
//           onClick={handleScheduleService}
//           disabled={isSubmitting}
//           className="w-full py-3 bg-purple1 text-white rounded-lg font-medium mt-8 disabled:bg-purple1/50"
//         >
//           {isSubmitting ? "Scheduling..." : "Schedule Service"}
//         </button>
//       </div>
      
//       <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-10">
//         <ButtonNavigation />
//       </div>
//     </div>
//   );
// };

// export default ServiceSummary;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import ButtonNavigation from "@/components/ButtonNavigation";
import toast from "react-hot-toast";
import BookingConfirmation from "@/components/BookingConfirmation";
import PaymentPage from "@/components/PaymentPage";
import PaymentProcessing from "@/components/PaymentProcessing";

interface SelectedService {
  id: string;
  name: string;
  unitCount: number;
  pricePerUnit: number;
}

interface AddressDetails {
  id?: string;
  name: string;
  address: string;
  isDefault?: boolean;
  isNew?: boolean;
  isCurrent?: boolean;
}

interface BookingData {
  services: SelectedService[];
  totalAmount: number;
  dateTime: string;
  description: string;
  address: AddressDetails;
}

const ServiceSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState({
    dateTime: false,
    address: false,
  });
  const [editedAddress, setEditedAddress] = useState<string>("");
  const [editedDateTime, setEditedDateTime] = useState<Date | null>(null);
  
  // Confirmation popup state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  
  // Payment flow states
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  
  // Available time slots for editing
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  useEffect(() => {
    // Parse booking data from URL params
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setBookingData(parsedData);
        
        if (parsedData.address) {
          setEditedAddress(parsedData.address.address);
        }
        
        if (parsedData.dateTime) {
          setEditedDateTime(new Date(parsedData.dateTime));
        }
      } catch (error) {
        console.error("Error parsing booking data:", error);
        toast.error("Invalid booking data");
        router.push("/user/dashboard/services");
      }
    } else {
      toast.error("No booking data found");
      router.push("/user/dashboard/services");
    }
  }, [dataParam, router]);

  const handleEditField = (field: keyof typeof editMode) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    
    // Save changes when toggling off edit mode
    if (editMode[field]) {
      if (field === 'address') {
        setEditMode(prev => ({ ...prev, address: false }));
      } else if (field === 'dateTime') {
        setEditMode(prev => ({ ...prev, dateTime: false }));
      }
    }
  };

  const handleUpdateDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDateTime(new Date(e.target.value));
  };

  const handleUpdateAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedAddress(e.target.value);
  };

  const handleUpdateTime = (time: string) => {
    if (!editedDateTime) return;
    
    // Parse time string like "08:00 AM"
    const [timeStr, period] = time.split(" ");
    const [hourStr, minuteStr] = timeStr.split(":");
    
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert to 24-hour format
    if (period === "PM" && hour < 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    
    const newDateTime = new Date(editedDateTime);
    newDateTime.setHours(hour);
    newDateTime.setMinutes(minute);
    
    setEditedDateTime(newDateTime);
    
    setEditMode((prev) => ({
      ...prev,
      dateTime: false,
    }));
  };

  // Handles proceeding to payment 
  const handleProceedToPayment = () => {
    if (!bookingData) {
      toast.error("Missing booking data");
      return;
    }
    
    // Show the payment page first
    setShowPaymentPage(true);
  };

  // Handle confirmation of payment from payment page
  const handleConfirmPayment = () => {
    setShowPaymentPage(false);
    setShowPaymentProcessing(true);
  };

  // Handle cancellation of payment from payment page
  const handleCancelPayment = () => {
    setShowPaymentPage(false);
    // Just go back to summary page
    toast.error("Payment cancelled");
  };

  // Handle successful payment process completion
  const handlePaymentSuccess = async () => {
    setShowPaymentProcessing(false);
    
    if (!bookingData) {
      toast.error("Missing booking data");
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting order...");

    try {
      // Prepare services data for API
      const servicesData = bookingData.services.map(service => ({
        id: service.id,
        name: service.name,
        units: service.unitCount,
        cost: service.pricePerUnit * service.unitCount
      }));

      // Get address ID if using existing address
      let addressId = null;
      if (bookingData.address && !bookingData.address.isNew && !bookingData.address.isCurrent) {
        addressId = bookingData.address.id || null;
      }

      // Format dateTime properly
      const dateTimeToUse = editedDateTime || new Date(bookingData.dateTime);
      const formattedTime = format(dateTimeToUse, "hh:mm a");

      const orderData = {
        address: editedAddress || bookingData.address.address,
        addressId: addressId,
        date: dateTimeToUse.toISOString(),
        time: formattedTime,
        services: servicesData,
        description: bookingData.description || "",
        status: "PENDING",
        paymentStatus: "PAID" // Add payment status
      };

      console.log("Order data:", orderData);

      // Create order request
      const response = await fetch("/api/user/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status);
      
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        // Show confirmation popup
        setOrderId(responseData.order.id);
        setShowConfirmation(true);
      } else {
        toast.error(responseData.message || "Failed to schedule service");
      }
    } catch (error) {
      console.error("Error scheduling service:", error);
      toast.error("An error occurred while scheduling your service");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle failed payment process completion
  const handlePaymentFailure = () => {
    setShowPaymentProcessing(false);
    toast.error("Payment was declined");
    // Stay on the summary page
  };

  // Skip payment page during testing - direct to processing with manual confirmation
  const handleDirectToProcessing = () => {
    if (!bookingData) {
      toast.error("Missing booking data");
      return;
    }
    
    // Directly show the payment processing screen with manual controls
    setShowPaymentProcessing(true);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <HeaderWithBackButton title="Service Summary" />
        <div className="mt-10 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple1"></div>
        </div>
      </div>
    );
  }

  // If payment page is shown
  if (showPaymentPage) {
    return (
      <PaymentPage 
        amount={bookingData.totalAmount}
        onBack={() => setShowPaymentPage(false)}
        onConfirmPayment={handleConfirmPayment}
        onCancelPayment={handleCancelPayment}
      />
    );
  }

  const formattedDateTime = editedDateTime 
    ? format(editedDateTime, "MMMM d, yyyy 'at' h:mm aa") 
    : format(new Date(bookingData.dateTime), "MMMM d, yyyy 'at' h:mm aa");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <HeaderWithBackButton title="Service Summary" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Service Details */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Service Details</h3>
          
          {/* Date & Time */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Date & Time</p>
              <button
                onClick={() => handleEditField('dateTime')}
                className="text-purple1 text-sm"
              >
                {editMode.dateTime ? "Save" : "Edit"}
              </button>
            </div>
            
            {editMode.dateTime ? (
              <div className="space-y-3">
                <input
                  type="datetime-local"
                  value={editedDateTime ? format(editedDateTime, "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={handleUpdateDateTime}
                  min={new Date().toISOString().split('.')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Quick Select Time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        onClick={() => handleUpdateTime(time)}
                        className="p-2 text-center border rounded-lg cursor-pointer text-sm border-gray-300 hover:bg-purple1 hover:text-white hover:border-purple1"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-medium">{formattedDateTime}</p>
            )}
          </div>
          
          {/* Address */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Address</p>
              <button
                onClick={() => handleEditField('address')}
                className="text-purple1 text-sm"
              >
                {editMode.address ? "Save" : "Edit"}
              </button>
            </div>
            
            {editMode.address ? (
              <textarea
                value={editedAddress}
                onChange={handleUpdateAddress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            ) : (
              <p className="font-medium">{editedAddress || bookingData.address.address}</p>
            )}
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Selected Services</h3>
          
          <div className="space-y-3 mb-4">
            {bookingData.services.map((service) => (
              <div key={service.id} className="flex justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-gray-600">₹{service.pricePerUnit.toFixed(2)} × {service.unitCount}</p>
                </div>
                <p className="font-semibold">₹{(service.pricePerUnit * service.unitCount).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <p className="font-medium">Total</p>
            <p className="font-bold text-green4">₹{bookingData.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Additional Information */}
        {bookingData.description && (
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Additional Details</h3>
            <p className="text-gray-700">{bookingData.description}</p>
          </div>
        )}

        {/* For testing - you can choose which button to use based on your needs */}
        {/* Option 1: Standard flow through payment page */}
        <button
          onClick={handleProceedToPayment}
          disabled={isSubmitting}
          className="w-full py-3 bg-purple1 text-white rounded-lg font-medium mt-8 disabled:bg-purple1/50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? "Processing..." : "Proceed to Payment"}
        </button>

        {/* Option 2: Direct to manual approval/decline flow */}
        {/* 
        <button
          onClick={handleDirectToProcessing}
          disabled={isSubmitting}
          className="w-full py-3 bg-purple1 text-white rounded-lg font-medium mt-8 disabled:bg-purple1/50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? "Processing..." : "Process Payment"}
        </button>
        */}
      </div>
      
      <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-10">
        <ButtonNavigation />
      </div>
      
      {/* Payment Processing Modal with Manual Controls */}
      <PaymentProcessing 
        isOpen={showPaymentProcessing}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />
      
      {/* Booking Confirmation Popup */}
      <BookingConfirmation 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderId={orderId}
      />
    </div>
  );
};

export default ServiceSummary;