"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import Image from "next/image";

const BankingPaymentPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Fetch order details from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedOrderDetails = localStorage.getItem("orderDetails");
        if (savedOrderDetails) {
          setOrderDetails(JSON.parse(savedOrderDetails));
        }
      } catch (error) {
        console.error("Error loading order details:", error);
      }
      setLoading(false);
    }
  }, []);

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Store payment information in localStorage
      if (orderDetails) {
        const updatedOrderDetails = {
          ...orderDetails,
          paymentStatus: "completed",
          paymentMethod: selectedPaymentMethod,
          paymentDate: new Date().toISOString(),
          transactionId: "TXN" + Math.floor(Math.random() * 1000000000)
        };
        localStorage.setItem("orderDetails", JSON.stringify(updatedOrderDetails));
      }
      
      // Redirect to confirmation page
      router.push("/user/dashboard/service/confirmation");
    }, 2000);
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
      <HeaderWithBackButton title="Payment" />

      <div className="border rounded-lg p-4 bg-gray-50 mb-4">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        <div className="flex justify-between items-center pt-2 font-bold">
          <p>Total Amount</p>
          <p className="text-green-600">₹{orderDetails?.totalAmount || 0}</p>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* UPI Options */}
          <div 
            className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer ${selectedPaymentMethod === 'googlePay' ? 'border-lightpurple bg-purple-50' : ''}`}
            onClick={() => handlePaymentMethodSelect('googlePay')}
          >
            <div className="h-12 w-12 mb-2 relative">
              <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center">
                <Image src="/Icon/google-pay.png" height={100} width={100} alt=""/>
              </div>
            </div>
            <p className="text-sm font-medium">Google Pay</p>
          </div>
          
          <div 
            className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer ${selectedPaymentMethod === 'phonePe' ? 'border-lightpurple bg-purple-50' : ''}`}
            onClick={() => handlePaymentMethodSelect('phonePe')}
          >
            <div className="h-12 w-12 mb-2 relative">
              <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center">
              <Image src="/Icon/phonepe.png" height={60} width={60} alt=""/>
              </div>
            </div>
            <p className="text-sm font-medium">PhonePe</p>
          </div>
          
          <div 
            className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer ${selectedPaymentMethod === 'paytm' ? 'border-lightpurple bg-purple-50' : ''}`}
            onClick={() => handlePaymentMethodSelect('paytm')}
          >
            <div className="h-12 w-12 mb-2 relative">
              <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center">
              <Image src="/Icon/paytm.webp" height={100} width={100} alt=""/>
              </div>
            </div>
            <p className="text-sm font-medium">Paytm</p>
          </div>
          
          <div 
            className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer ${selectedPaymentMethod === 'bhim' ? 'border-lightpurple bg-purple-50' : ''}`}
            onClick={() => handlePaymentMethodSelect('bhim')}
          >
            <div className="h-12 w-12 mb-2 relative">
              <div className="bg-gray-200 h-full w-full rounded-full flex items-center justify-center">
              <Image src="/Icon/bhim-upi.webp" height={100} width={100} alt=""/>
              </div>
            </div>
            <p className="text-sm font-medium">BHIM UPI</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-lg font-bold mb-2">Other Payment Methods</h2>
        
        <div 
          className={`border rounded-lg p-3 mb-3 flex items-center cursor-pointer ${selectedPaymentMethod === 'creditCard' ? 'border-lightpurple bg-purple-50' : ''}`}
          onClick={() => handlePaymentMethodSelect('creditCard')}
        >
          <div className="h-10 w-10 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/Icon/credit-card.png" height={100} width={100} alt=""/>
          </div>
          <div>
            <p className="font-medium">Credit Card</p>
            <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-3 mb-3 flex items-center cursor-pointer ${selectedPaymentMethod === 'debitCard' ? 'border-lightpurple bg-purple-50' : ''}`}
          onClick={() => handlePaymentMethodSelect('debitCard')}
        >
          <div className="h-10 w-10 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/Icon/debit-card.png" height={100} width={100} alt=""/>
          </div>
          <div>
            <p className="font-medium">Debit Card</p>
            <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-3 flex items-center cursor-pointer ${selectedPaymentMethod === 'netBanking' ? 'border-lightpurple bg-purple-50' : ''}`}
          onClick={() => handlePaymentMethodSelect('netBanking')}
        >
          <div className="h-10 w-10 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/Icon/net-banking.jpg" height={100} width={100} alt=""/>
          </div>
          <div>
            <p className="font-medium">Net Banking</p>
            <p className="text-xs text-gray-500">All major banks</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-auto">
        <button
          onClick={handleProcessPayment}
          disabled={!selectedPaymentMethod || processingPayment}
          className="w-full py-3 px-4 bg-lightpurple text-white font-bold rounded-lg flex items-center justify-center"
        >
          {processingPayment ? (
            <span className="flex items-center">
              Processing Payment...
            </span>
          ) : (
            `Pay ₹${orderDetails?.totalAmount || 0}`
          )}
        </button>
      </div>
    </div>
  );
};

export default BankingPaymentPage;