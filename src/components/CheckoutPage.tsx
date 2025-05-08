"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import ButtonNavigation from "@/components/ButtonNavigation";
import Link from "next/link";

const CheckoutPage = () => {
  const router = useRouter();

  // State for checkout information
  interface SelectedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Get the current date for the date picker min value
  const today = new Date().toISOString().split("T")[0];

  // Load selected services from localStorage when component mounts
  useEffect(() => {
    // Set tomorrow as default scheduled date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split("T")[0]);

    // Client-side only code
    if (typeof window !== "undefined") {
      try {
        const savedServices = localStorage.getItem("selectedServices");
        const savedTotalAmount = localStorage.getItem("totalAmount");

        if (savedServices) {
          const parsedServices = JSON.parse(savedServices);
          setSelectedItems(parsedServices);
        } else {
          // If no data in localStorage, use default data for testing
          const defaultItems = [
            {
              id: "card1",
              name: "Default Service Name 1",
              price: 299,
              quantity: 1,
            },
            { id: "card3", name: "Service Name 3", price: 299, quantity: 2 },
          ];
          setSelectedItems(defaultItems);
        }

        if (savedTotalAmount) {
          setTotalAmount(Number(savedTotalAmount));
        } else {
          // Calculate default total if no saved total
          const defaultTotal = 299 * 3; // 1 quantity of first item + 2 quantity of second item
          setTotalAmount(defaultTotal);
        }

        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        // Use fallback data
        const fallbackItems = [
          {
            id: "card1",
            name: "Default Service Name 1",
            price: 299,
            quantity: 1,
          },
          { id: "card3", name: "Service Name 3", price: 299, quantity: 2 },
        ];
        setSelectedItems(fallbackItems);
        setTotalAmount(299 * 3);
        setDataLoaded(true);
      }
    }
  }, []);

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handleAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  const handleContactNumberChange = (e: any) => {
    setContactNumber(e.target.value);
  };

  const handleDateChange = (e: any) => {
    setScheduledDate(e.target.value);
  };

  const handleTimeChange = (e: any) => {
    setScheduledTime(e.target.value);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!address || !contactNumber || !scheduledDate || !scheduledTime) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Save order details to localStorage for other pages to use
      const orderDetails = {
        items: selectedItems,
        totalAmount,
        paymentMethod,
        address,
        contactNumber,
        scheduledDate,
        scheduledTime,
      };
      localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

      // Redirect based on payment method
      if (paymentMethod === "online") {
        // Redirect to banking payment page for online payment
        router.push("/user/dashboard/service/payment");
      } else {
        // For COD, go directly to confirmation page
        // Simulate API call with setTimeout
        setTimeout(() => {
          router.push("/user/dashboard/service/confirmation");
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setLoading(false);
      alert("There was an error processing your order. Please try again.");
    }
  };

  // Show loading state while data is being fetched
  if (!dataLoaded) {
    return (
      <div className="h-full w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightpurple"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-screen py-4 px-6 rounded-lg bg-white flex flex-col gap-4 relative pb-20">
      <HeaderWithBackButton title="Checkout" />

      <div className="h-full w-full flex flex-col gap-4 overflow-auto">
        {/* Order Summary */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-bold mb-2">Order Summary</h2>

          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">₹{item.price * item.quantity}</p>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 font-bold">
            <p>Total Amount</p>
            <p className="text-green-600">₹{totalAmount}</p>
          </div>
        </div>

        {/* Scheduling Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Schedule Service</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={handleDateChange}
              min={today}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Time</label>
            <select
              value={scheduledTime}
              onChange={handleTimeChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a time slot</option>
              <option value="09:00">09:00 AM - 10:00 AM</option>
              <option value="10:00">10:00 AM - 11:00 AM</option>
              <option value="11:00">11:00 AM - 12:00 PM</option>
              <option value="12:00">12:00 PM - 01:00 PM</option>
              <option value="13:00">01:00 PM - 02:00 PM</option>
              <option value="14:00">02:00 PM - 03:00 PM</option>
              <option value="15:00">03:00 PM - 04:00 PM</option>
              <option value="16:00">04:00 PM - 05:00 PM</option>
              <option value="17:00">05:00 PM - 06:00 PM</option>
            </select>
          </div>
        </div>

        {/* Contact and Address Information */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Contact Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={address}
              onChange={handleAddressChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your full address"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={handleContactNumberChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your 10-digit phone number"
              pattern="\d{10}"
              maxLength={10}
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Payment Method</h2>

          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="online"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={handlePaymentMethodChange}
              className="mr-2"
            />
            <label htmlFor="online" className="flex items-center">
              <span>Online Payment</span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Secure
              </span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={handlePaymentMethodChange}
              className="mr-2"
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 bg-lightpurple text-white font-bold rounded-lg flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                Processing...
              </span>
            ) : (
              paymentMethod === "online" ? "Proceed to Payment" : "Place Order"
            )}
          </button>
        </div>
      </div>

      <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-10">
        <ButtonNavigation />
      </div>
    </div>
  );
};

export default CheckoutPage;