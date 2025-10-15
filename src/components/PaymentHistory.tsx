"use client";
import React, { useState, useEffect } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import CaptainButtonNavigation from "./CaptainButtonNavigation";

interface PaymentHistory {
  id: string;
  transactionId?: string;
  booking?: {
    order?: {
      orderServices?: {
        service?: {
          name?: string;
        };
      }[];
    };
  };
  order?: string;
  createdAt: string;
  amount: number;
  status?: string;
}

function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch payment history data from API
    const fetchPaymentHistory = async () => {
      try {
        // Modify this API endpoint to match your backend route
        const response = await fetch("/api/payments/history");

        if (!response.ok) {
          throw new Error("Failed to fetch payment history");
        }

        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Format date to "DD MMM, YYYY" format
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="text-4xl">
          <BiLeftArrowAlt />
        </div>
        <div className="h-full w-full flex items-center gap-2">
          <div className="h-8 w-1 rounded-xl bg-[#CABDFF]"></div>
          <h2 className="text-xl font-bold">Payment History</h2>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-8">Loading payment history...</div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">{error}</div>
      ) : payments.length === 0 ? (
        <div className="text-center mt-8">No payment history found.</div>
      ) : (
        payments.map((payment) => (
          <div
            key={payment.id}
            className="p-4 border-2 border-slate-300 flex flex-col rounded-xl mt-4 gap-4"
          >
            <div className="flex justify-between items-end text-xl">
              <p>Payment Method : </p>
              <p className="text-lightpurple font-semibold">
                {payment.transactionId ? "Online" : "Cash"}
              </p>
            </div>
            <p className="text-gray1 text-lg">
              {payment.booking?.order?.orderServices?.[0]?.service?.name ||
                "Service"}
            </p>
            <div className="bg-[#F0F0FA] p-2 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <h3 className="font-semibold text-lg">Amount</h3>
                <p className="text-lightpurple font-semibold">
                  ₹{payment.amount}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <h3 className="font-semibold text-lg">Date</h3>
                <p className="text-gray1">{formatDate(payment.createdAt)}</p>
              </div>
              <div className="flex justify-between items-end">
                <h3 className="font-semibold text-lg">Status</h3>
                <p
                  className={`font-semibold ${
                    payment.status === "COMPLETED"
                      ? "text-green-500"
                      : payment.status === "PENDING"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {payment.status}
                </p>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center mb-4">
        <CaptainButtonNavigation />
      </div>
    </div>
  );
}

export default PaymentHistory;

// import React from "react";
// import { BiLeftArrowAlt } from "react-icons/bi";
// import CaptainButtonNavigation from "./CaptainButtonNavigation";
// function PaymentHistory() {
//   return (
//     <div className="p-4">
//       {" "}
//       <div className="flex flex-col gap-4">
//         {" "}
//         <div className="text-4xl">
//           {" "}
//           <BiLeftArrowAlt />{" "}
//         </div>{" "}
//         <div className="h-full w-full flex items-center gap-2">
//           {" "}
//           <div
//             className="h-8 w-1 rounded-xl bg-[
//     #CABDFF]"
//           ></div>{" "}
//           <h2 className="text-xl font-bold">Payment History</h2>{" "}
//         </div>{" "}
//       </div>{" "}
//       <div className="p-4 border-2 border-slate-300 flex flex-col rounded-xl mt-4 gap-4">
//         {" "}
//         <div className="flex justify-between items-end text-xl">
//           {" "}
//           <p>Payment Method : </p>{" "}
//           <p className="text-lightpurple font-semibold">Cash</p>{" "}
//         </div>{" "}
//         <p className="text-gray1 text-lg">TV Repair</p>{" "}
//         <div
//           className="bg-[
//     #F0F0FA] p-2 rounded-xl flex flex-col gap-2"
//         >
//           {" "}
//           <div className="flex justify-between items-end">
//             {" "}
//             <h3 className="font-semibold text-lg">Amount</h3>{" "}
//             <p className="text-lightpurple font-semibold">₹1258</p>{" "}
//           </div>{" "}
//           <div className="flex justify-between items-end">
//             {" "}
//             <h3 className="font-semibold text-lg">Date</h3>{" "}
//             <p className="text-gray1">02 Dec, 2022</p>{" "}
//           </div>{" "}
//         </div>{" "}
//       </div>{" "}
//       <div className="p-4 border-2 border-slate-300 flex flex-col rounded-xl mt-4 gap-4">
//         {" "}
//         <div className="flex justify-between items-end text-xl">
//           {" "}
//           <p>Payment Method : </p>{" "}
//           <p className="text-lightpurple font-semibold">Cash</p>{" "}
//         </div>{" "}
//         <p className="text-gray1 text-lg">TV Repair</p>{" "}
//         <div
//           className="bg-[
//     #F0F0FA] p-2 rounded-xl flex flex-col gap-2"
//         >
//           {" "}
//           <div className="flex justify-between items-end">
//             {" "}
//             <h3 className="font-semibold text-lg">Amount</h3>{" "}
//             <p className="text-lightpurple font-semibold">₹1258</p>{" "}
//           </div>{" "}
//           <div className="flex justify-between items-end">
//             {" "}
//             <h3 className="font-semibold text-lg">Date</h3>{" "}
//             <p className="text-gray1">02 Dec, 2022</p>{" "}
//           </div>{" "}
//         </div>{" "}
//       </div>{" "}
//       <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center mb-4">
//         {" "}
//         <CaptainButtonNavigation />{" "}
//       </div>{" "}
//     </div>
//   );
// }
// export default PaymentHistory;
