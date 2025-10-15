import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PaymentProcessingProps {
  isOpen: boolean;
  onSuccess: () => void;
  onFailure: () => void;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  isOpen,
  onSuccess,
  onFailure,
}) => {
  const [status, setStatus] = useState<"processing" | "manual" | "success" | "failed">("processing");
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && status === "processing") {
      // After 3 seconds of processing, show manual controls
      timer = setTimeout(() => {
        setStatus("manual");
      }, 3000);
    } else if (status === "success") {
      // After success status, wait 5 seconds and call onSuccess
      timer = setTimeout(() => {
        onSuccess();
      }, 5000);
    } else if (status === "failed") {
      // After failed status, wait 5 seconds and call onFailure
      timer = setTimeout(() => {
        onFailure();
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, status, onSuccess, onFailure]);
  
  // Reset to processing when opened again
  useEffect(() => {
    if (isOpen) {
      setStatus("processing");
    }
  }, [isOpen]);

  const handleSuccess = () => {
    setStatus("success");
  };

  const handleFailure = () => {
    setStatus("failed");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-md animate-fadeIn">
        <div className="flex flex-col items-center justify-center py-4">
          {status === "processing" && (
            <>
              <div className="w-16 h-16 border-4 border-purple1 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-semibold text-center">Processing Payment</h3>
              <p className="text-gray-500 text-center mt-2">Please wait while we process your payment...</p>
            </>
          )}
          
          {status === "manual" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">Demo Payment Control</h3>
              <p className="text-gray-600 text-center mb-6">Select payment result for demonstration:</p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleSuccess}
                  className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex flex-col items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle className="mb-2" size={28} />
                  Success
                </button>
                
                <button
                  onClick={handleFailure}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex flex-col items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <XCircle className="mb-2" size={28} />
                  Decline
                </button>
              </div>
            </>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center justify-center animate-fadeIn">
              <CheckCircle size={64} className="text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-center">Payment Successful!</h3>
              <p className="text-gray-500 text-center mt-2">Your booking is being confirmed...</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-6 overflow-hidden">
                <div className="bg-green-500 h-full animate-progressBar"></div>
              </div>
            </div>
          )}
          
          {status === "failed" && (
            <div className="flex flex-col items-center justify-center animate-fadeIn">
              <XCircle size={64} className="text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-center">Payment Failed</h3>
              <p className="text-gray-500 text-center mt-2">Returning to summary page...</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-6 overflow-hidden">
                <div className="bg-red-500 h-full animate-progressBar"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;