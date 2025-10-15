// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { useSearchParams } from "next/navigation";
// import HeaderWithBackButton from "@/components/HeaderWithBackButton";
// import ServiceAddCard from "@/components/ServiceAddCard";
// import ButtonNavigation from "@/components/ButtonNavigation";
// import Link from "next/link";

// interface Service {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
// }


// const SearchPage = () => {
//   const searchParams = useSearchParams();
//   const keyword = searchParams.get("q")?.trim() || "";

//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalItemCount, setTotalItemCount] = useState(0);
//   const [itemCounts, setItemCounts] = useState<{ [key: string]: number }>({});

//   const fetchServices = async () => {
//     try {
//       const res = await fetch(`/api/services/search`, {
//         method: "POST",
//         body: JSON.stringify({ keyword }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         setServices(data.data);
//       } else {
//         console.error("Error:", data.message);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (keyword) fetchServices();
//   }, [keyword]);

//   const handleItemCountChange = useCallback((id: string, count: number) => {
//     setItemCounts((prev) => {
//       const updated = { ...prev, [id]: count };
//       const total = Object.values(updated).reduce((sum, val) => sum + val, 0);
//       setTotalItemCount(total);
//       return updated;
//     });
//   }, []);

//   if (loading) return <p className="p-4">Loading services...</p>;

//   return (
//     <div className="p-4 space-y-4">
//       <HeaderWithBackButton title={`Results for "${keyword}"`} />

//       {services.length === 0 ? (
//         <p>No services found for "{keyword}"</p>
//       ) : (
//         services.map((service) => (
//           <ServiceAddCard
//             key={service.id}
//             id={service.id}
//             name={service.name}
//             description={service.description}
//             price={service.price}
//             onItemCountChange={handleItemCountChange}
//           />
//         ))
//       )}

//       {totalItemCount > 0 && (
//         <div className="mt-6 text-right">
//           <p>Total Items: {totalItemCount}</p>
//           <p className="text-green-600 font-bold">
//             Total Price: ₹
//             {services.reduce((acc, service) => {
//               const count = itemCounts[service.id] || 0;
//               return acc + count * service.price;
//             }, 0)}
//           </p>

//           <Link href="/schedule">
//             <button className="mt-2 px-6 py-2 bg-lightpurple text-white rounded-xl">
//               Proceed to Checkout
//             </button>
//           </Link>
//         </div>
//       )}

//       <ButtonNavigation />
//     </div>
//   );
// };

// export default SearchPage;

export default function SearchTestPage() {
    return <h1>This is the search page working!</h1>;
  }
  
