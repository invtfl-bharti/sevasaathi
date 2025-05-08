"use client";
import React, { useState, useEffect } from "react";

// Extend the Window interface to include UPIPayment
declare global {
  interface Window {
    UPIPayment?: any;
    Razorpay?: any;
  }
}


import { useRouter } from "next/navigation";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import Image from "next/image";

interface OrderDetails {
  totalAmount: number;
  orderId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceName?: string;
}

const BankingPaymentPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  interface PaymentData {
    orderId: string;
    paymentUrl?: string;
    apiKey?: string;
    amount?: number;
    currency?: string;
    merchantName?: string;
    transactionId?: string;
    merchantVpa?: string;
  }
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

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

  const handlePaymentMethodSelect = (method: any) => {
    setSelectedPaymentMethod(method);
  };

  // Function to initialize payment with chosen gateway
  const initializePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setProcessingPayment(true);

    try {
      // Prepare payment data
      const paymentRequestData = {
        amount: orderDetails?.totalAmount || 0,
        currency: "INR",
        orderId: orderDetails?.orderId || `ORDER_${Date.now()}`,
        paymentMethod: selectedPaymentMethod,
        customerDetails: {
          name: orderDetails?.userName || "",
          email: orderDetails?.userEmail || "",
          phone: orderDetails?.userPhone || "",
        },
        // Add any additional data required by your chosen payment gateway
      };

      // Call your backend API to create payment intent
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequestData),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentData = await response.json();
      setPaymentData(paymentData);

      // Handle different payment methods
      switch (selectedPaymentMethod) {
        case 'googlePay':
        case 'phonePe':
        case 'paytm':
        case 'bhim':
          handleUpiPayment(paymentData);
          break;
        case 'creditCard':
        case 'debitCard':
          handleCardPayment(paymentData);
          break;
        case 'netBanking':
          handleNetBankingPayment(paymentData);
          break;
        default:
          throw new Error('Invalid payment method');
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Payment initialization failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Handle UPI payments (GooglePay, PhonePe, Paytm, BHIM)
  const handleUpiPayment = async (paymentData: any) => {
    try {
      if (typeof window !== "undefined" && window.UPIPayment) {
        // Example using a hypothetical UPI SDK
        window.UPIPayment.startPayment({
          vpa: paymentData.merchantVpa,
          payeeName: paymentData.merchantName,
          transactionId: paymentData.transactionId,
          transactionRef: paymentData.orderId,
          description: `Payment for ${orderDetails?.serviceName || 'service'}`,
          amount: orderDetails?.totalAmount || 0,
          onSuccess: (response: any) => {
            // Handle successful payment
            handlePaymentSuccess({
              ...response,
              paymentMethod: selectedPaymentMethod
            });
          },
          onFailure: (error: any ) => {
            console.error("UPI payment failed:", error);
            alert("Payment failed. Please try again.");
            setProcessingPayment(false);
          }
        });
      } else {
        // Fallback to redirect for UPI apps
        window.location.href = paymentData.paymentUrl;
      }
    } catch (error) {
      console.error("UPI payment error:", error);
      alert("Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Handle card payments
  const handleCardPayment = (paymentData: any) => {
    try {
      // Implement or embed payment gateway's card form
      // This could be Razorpay, Stripe, PayU, etc.
      
      // Example for Razorpay
      if (typeof window !== "undefined" && window.Razorpay) {
        const razorpayOptions = {
          key: paymentData.apiKey,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: paymentData.merchantName,
          description: `Payment for ${orderDetails?.serviceName || 'service'}`,
          order_id: paymentData.orderId,
          handler: function (response: any) {
            handlePaymentSuccess({
              ...response,
              paymentMethod: selectedPaymentMethod
            });
          },
          prefill: {
            name: orderDetails?.userName || "",
            email: orderDetails?.userEmail || "",
            contact: orderDetails?.userPhone || ""
          },
          theme: {
            color: "#6c63ff"
          },
          modal: {
            ondismiss: function() {
              setProcessingPayment(false);
            }
          }
        };
        
        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } else {
        // Fallback to redirect
        window.location.href = paymentData.paymentUrl;
      }
    } catch (error) {
      console.error("Card payment error:", error);
      alert("Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Handle net banking payments
  const handleNetBankingPayment = (paymentData: any) => {
    try {
      // Redirect to net banking page provided by the payment gateway
      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      console.error("Net banking payment error:", error);
      alert("Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      // Verify payment with backend
      const verificationResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentData?.orderId || '',
          paymentId: paymentResponse.razorpay_payment_id || paymentResponse.paymentId,
          signature: paymentResponse.razorpay_signature || paymentResponse.signature
        }),
      });

      if (!verificationResponse.ok) {
        throw new Error('Payment verification failed');
      }

      const verificationResult = await verificationResponse.json();

      if (verificationResult.success) {
        // Update order details in localStorage
        if (orderDetails) {
          const updatedOrderDetails = {
            ...orderDetails,
            paymentStatus: "completed",
            paymentMethod: selectedPaymentMethod,
            paymentDate: new Date().toISOString(),
            transactionId: paymentResponse.razorpay_payment_id || 
                          paymentResponse.paymentId || 
                          paymentResponse.txnId || 
                          `TXN${Math.floor(Math.random() * 1000000000)}`
          };
          localStorage.setItem("orderDetails", JSON.stringify(updatedOrderDetails));
        }
        
        // Redirect to confirmation page
        router.push("/user/dashboard/service/confirmation");
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
      setProcessingPayment(false);
    }
  };

  // Display loading spinner while fetching order details
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
          onClick={initializePayment}
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