"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import { XCircle } from "lucide-react";

const PaymentFailedPage = () => {
  const router = useRouter();
  interface OrderDetails {
    serviceName: string;
    totalAmount: number;
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch order details from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedOrderDetails = localStorage.getItem("orderDetails");
        if (savedOrderDetails) {
          setOrderDetails(JSON.parse(savedOrderDetails));
        }
        
        // Get error message from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get("error");
        if (error) {
          setErrorMessage(error);
        }
      } catch (error) {
        console.error("Error loading order details:", error);
      }
      setLoading(false);
    }
  }, []);

  const handleRetryPayment = () => {
    router.push("/user/dashboard/service/payment");
  };

  const handleGoToDashboard = () => {
    router.push("/user/dashboard");
  };

  if (loading) {
    return (
      <div className="h-full w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightpurple"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-screen py-4 px-6 rounded-lg bg-white flex flex-col gap-4">
      <HeaderWithBackButton title="Payment Failed" />

      <div className="flex flex-col items-center justify-center my-8">
        <XCircle className="text-red-500 w-24 h-24 mb-4" />
        <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
        <p className="text-gray-500 text-center mt-2">
          {errorMessage || "Your payment could not be processed successfully"}
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 mb-4">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        <div className="flex justify-between items-center">
          <p>Service</p>
          <p className="font-medium">{orderDetails?.serviceName || "N/A"}</p>
        </div>
        <div className="flex justify-between items-center pt-2 font-bold">
          <p>Total Amount</p>
          <p className="text-red-600">₹{orderDetails?.totalAmount || 0}</p>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-lg font-bold mb-2">Common Issues</h2>
        <ul className="list-disc pl-5 text-gray-600">
          <li className="mb-1">Insufficient funds in your account</li>
          <li className="mb-1">Bank server timeout</li>
          <li className="mb-1">Transaction declined by bank</li>
          <li className="mb-1">Network connectivity issues</li>
          <li className="mb-1">Payment gateway technical error</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={handleRetryPayment}
          className="w-full py-3 px-4 bg-lightpurple text-white font-bold rounded-lg"
        >
          Retry Payment
        </button>
        <button
          onClick={handleGoToDashboard}
          className="w-full py-3 px-4 border border-lightpurple text-lightpurple font-bold rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentFailedPage;