"use client";

import React, { useState, useCallback, useEffect } from "react";
import ServiceAddCard from "@/components/ServiceAddCard";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import ButtonNavigation from "@/components/ButtonNavigation";
import { useRouter } from "next/navigation";
import { BiRightArrowAlt } from "react-icons/bi";

const ServicePage = () => {
  const router = useRouter();
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [itemCounts, setItemCounts] = useState<{ [key: string]: number }>({});
  
  const handleItemCountChange = useCallback((id: string, count: number) => {
    setItemCounts((prevCounts) => {
      const newCounts = { ...prevCounts, [id]: count };
      const total = Object.values(newCounts).reduce(
        (acc, curr) => acc + curr,
        0
      );
      setTotalItemCount(total);
      return newCounts;
    });
  }, []);
  
  // Save service data to localStorage
  const saveServiceData = () => {
    const selectedItems = Object.entries(itemCounts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const service = {
          id,
          name: getServiceNameById(id),
          price: 299,
          quantity: count
        };
        return service;
      });
    
    if (selectedItems.length > 0) {
      try {
        localStorage.setItem('selectedServices', JSON.stringify(selectedItems));
        localStorage.setItem('totalAmount', String(totalItemCount * 299));
        return true;
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        return false;
      }
    }
    return false;
  };
  
  // Helper function to get service name by id
  const getServiceNameById = (id: string) => {
    switch (id) {
      case "card1":
        return "Default Service Name 1";
      case "card2":
        return "Default Service Name 2";
      case "card3":
        return "Service Name 3";
      case "card4":
        return "Default Service Name 4";
      default:
        return "Unknown Service";
    }
  };

  // Enhanced checkout function using Next.js router and direct navigation
  const handleCheckout = () => {
    if (saveServiceData()) {
      // Try Next.js router first (most reliable in Next.js apps)
      try {
        router.push("/user/dashboard/service/checkout");
        return;
      } catch (err) {
        console.log("Router navigation failed, trying direct methods");
      }
      
      // Direct navigation as fallback
      window.location.href = "/user/dashboard/service/checkout";
    }
  };
  
  // Direct link as a separate fallback
  const directCheckoutLink = () => {
    saveServiceData();
    // Use direct window location change
    window.location.href = "/user/dashboard/service/checkout";
  };

  return (
    <div className="h-full w-screen py-4 px-6 rounded-lg bg-white flex flex-col gap-4 relative">
      <HeaderWithBackButton title="AC Services" />
      <div className="h-full w-full flex flex-col justify-between gap-4">
        <hr />
        <ServiceAddCard
          id="card1"
          name="Default Service Name 1"
          description="Default description for Service 1"
          price={299}
          onItemCountChange={handleItemCountChange}
        />
        <hr />
        <ServiceAddCard
          id="card2" 
          name="Default Service Name 2"
          description="Default description for Service 2" 
          price={299}
          onItemCountChange={handleItemCountChange}
        />
        <hr />
        <ServiceAddCard
          id="card3"
          name="Service Name 3"
          description="Description for Service 3"
          price={299}
          onItemCountChange={handleItemCountChange}
        />
        <hr />
        <ServiceAddCard
          id="card4"
          name="Default Service Name 4"
          description="Default description for Service 4"
          price={299}
          onItemCountChange={handleItemCountChange}
        />
      </div>
      
      {totalItemCount > 0 && (
        <div className="fixed top-0 right-0 left-0 p-4 bg-white shadow-sm z-50 font-bold flex justify-end">
          <div className="mr-4">
            <p>Total Items: {totalItemCount}</p>
            <p className="text-green-600">Total Price: ₹{totalItemCount * 299}</p>
          </div>
        </div>
      )}
      
      {totalItemCount > 0 && (
        <div className="flex flex-col mt-10 items-center justify-center gap-2">
          {/* Primary button using React event handling */}
          <button 
            onClick={handleCheckout}
            className="border-2 py-3 px-8 border-lightpurple bg-lightpurple text-white rounded-2xl flex items-center justify-center gap-2 font-bold transition-all hover:bg-purple-700 active:bg-purple-800 shadow-md"
          >
            <span>Proceed to Checkout</span>
            <BiRightArrowAlt className="text-2xl"/>
            {/* <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg> */}
          </button>
          
          {/* Fallback traditional anchor link */}
          <a 
            href="/user/dashboard/service/checkout"
            onClick={(e) => {
              e.preventDefault();
              directCheckoutLink();
            }}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Having trouble? Click here
          </a>
          
          {/* Fallback form for guaranteed navigation */}
          <form 
            action="/user/dashboard/service/checkout" 
            method="get" 
            id="checkout-form"
            style={{ display: 'none' }}
          >
            <input type="hidden" name="data" value="checkout" />
            <button 
              type="submit" 
              id="hidden-checkout-submit"
            >
              Checkout
            </button>
          </form>
        </div>
      )}
      
      {/* Keep ButtonNavigation, but with reduced z-index */}
      <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-5">
        <ButtonNavigation />
      </div>
    </div>
  );
};

export default ServicePage;