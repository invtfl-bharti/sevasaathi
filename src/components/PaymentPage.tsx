import React, { useState } from "react";
import { CreditCard, DollarSign, ArrowLeft } from "lucide-react";

interface PaymentPageProps {
  amount: number;
  onBack: () => void;
  onConfirmPayment: () => void;
  onCancelPayment: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  amount,
  onBack,
  onConfirmPayment,
  onCancelPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  
  // Demo card details
  const [cardDetails, setCardDetails] = useState({
    number: "4242 4242 4242 4242",
    name: "John Doe",
    expiry: "12/25",
    cvv: "123",
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Payment</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Payment Amount */}
        <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-2">Total Amount</p>
          <h2 className="text-3xl font-bold text-purple1">₹{amount.toFixed(2)}</h2>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div 
              className={`p-4 border rounded-xl flex flex-col items-center cursor-pointer transition-all ${
                paymentMethod === "card" 
                  ? "border-purple1 bg-purple-50" 
                  : "border-gray-200"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard className={`mb-2 ${paymentMethod === "card" ? "text-purple1" : "text-gray-500"}`} />
              <span className={`${paymentMethod === "card" ? "font-medium text-purple1" : "text-gray-600"}`}>
                Credit/Debit Card
              </span>
            </div>
            
            <div 
              className={`p-4 border rounded-xl flex flex-col items-center cursor-pointer transition-all ${
                paymentMethod === "cash" 
                  ? "border-purple1 bg-purple-50" 
                  : "border-gray-200"
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              <DollarSign className={`mb-2 ${paymentMethod === "cash" ? "text-purple1" : "text-gray-500"}`} />
              <span className={`${paymentMethod === "cash" ? "font-medium text-purple1" : "text-gray-600"}`}>
                Cash on Delivery
              </span>
            </div>
          </div>

          {/* Card Details Form (Only shown for card payment) */}
          {paymentMethod === "card" && (
            <div className="space-y-3 border border-gray-200 p-4 rounded-xl">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 italic mt-2">
                This is a demo payment page. In a real application, you would securely enter your card details.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button
            onClick={onConfirmPayment}
            className="w-full py-3 bg-purple1 text-white rounded-lg font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm Payment
          </button>
          
          <button
            onClick={onCancelPayment}
            className="w-full py-3 bg-white border border-red-500 text-red-500 rounded-lg font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;