"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import ServiceCategoryCardForALlCategories from "@/components/ServiceCategoryCardForALlCategories";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  imageURL: string | null;
}

const CategoryPage = () => {
  const searchPlaceholder = "Search Category";
  const router = useRouter();
  
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define colors for category backgrounds
  const bgColors = [
    "#FFBC99", // AC Repair
    "#ADD8E6", // Appliance
    "#90EE90", // Painting
    "#FFD700", // Cleaning
    "#D8BFD8", // Plumbing
    "#F08080", // Electronics
    "#98FB98"  // Shifting
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/service-categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch service categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching service categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/user/dashboard/services/${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col justify-between gap-4 h-full w-full">
        <HeaderWithBackButton title="All Categories" />
        <SearchBar searchPlaceholder={searchPlaceholder} />
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="h-full w-full">
                <div className="h-full w-full flex flex-col items-center">
                  <div className="w-full aspect-square rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col justify-between gap-4 h-full w-full">
        <HeaderWithBackButton title="All Categories" />
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col justify-between gap-4 h-full w-full">
      <HeaderWithBackButton title="All Categories" />
      
      <SearchBar searchPlaceholder={searchPlaceholder} />

      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-4 mt-4 items-center">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="h-full w-full cursor-pointer"
              onClick={() => handleCategorySelect(category.id)}
            >
              <ServiceCategoryCardForALlCategories
                iconSrc={category.imageURL || `/Icon/${category.name.toLowerCase().replace(/\s+/g, '_')}.png`}
                bgColor={bgColors[index % bgColors.length]}
                imageAltText={category.name}
                text={category.name}
                height={40}
                width={40}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;