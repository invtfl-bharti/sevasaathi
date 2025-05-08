"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import { CheckCircle } from "lucide-react";

type OrderDetails = {
  transactionId: string;
  paymentMethod: string;
  paymentDate: string;
  serviceName: string;
  totalAmount: number;
};

const ConfirmationPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedOrderDetails = localStorage.getItem("orderDetails");
        if (savedOrderDetails) {
          setOrderDetails(JSON.parse(savedOrderDetails));
        } else {
          // If no order details found, redirect to dashboard
          router.push("/user/dashboard");
        }
      } catch (error) {
        console.error("Error loading order details:", error);
      }
      setLoading(false);
    }
  }, [router]);

  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <HeaderWithBackButton title="Payment Successful" />

      <div className="flex flex-col items-center justify-center my-8">
        <CheckCircle className="text-green-500 w-24 h-24 mb-4" />
        <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
        <p className="text-gray-500 text-center mt-2">
          Your payment has been successfully processed
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 mb-4">
        <h2 className="text-lg font-bold mb-4 text-center">Payment Details</h2>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Transaction ID</p>
            <p className="font-medium">{orderDetails?.transactionId}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-500">Payment Method</p>
            <p className="font-medium capitalize">{orderDetails?.paymentMethod}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-500">Payment Date</p>
            <p className="font-medium">{formatDate(orderDetails?.paymentDate)}</p>
          </div>

          <div className="border-t my-2"></div>

          <div className="flex justify-between items-center">
            <p className="text-gray-500">Service</p>
            <p className="font-medium">{orderDetails?.serviceName}</p>
          </div>

          <div className="flex justify-between items-center pt-2 font-bold">
            <p>Total Amount</p>
            <p className="text-green-600">₹{orderDetails?.totalAmount || 0}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={handleGoToDashboard}
          className="w-full py-3 px-4 bg-lightpurple text-white font-bold rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;