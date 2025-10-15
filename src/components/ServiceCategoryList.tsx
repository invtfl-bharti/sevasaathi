"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ServiceCategoryCard from "@/components/ServiceCategoryCard";
import Link from "next/link";

// Define the type for a service category
interface ServiceCategory {
  id: string;
  name: string;
  iconSrc: string;
  bgColor: string;
  imageURL: string;
}

const ServiceCategoryList = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Use this to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/service-categories");

        if (!response.ok) {
          throw new Error("Failed to fetch service categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching service categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      fetchCategories();
    }
  }, [isMounted]);

  // Return a placeholder during server-side rendering to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="h-full w-full grid grid-cols-4 gap-6 py-4 px-6 rounded-lg bg-white">
        {/* Empty skeleton placeholders */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-full w-full flex flex-col items-center">
            <div className="w-full aspect-square rounded-full bg-gray-200"></div>
            <div className="h-4 w-16 bg-gray-200 rounded mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full grid grid-cols-4 gap-6 py-4 px-6 rounded-lg bg-white">
        {/* Loading skeleton placeholders */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-full w-full flex flex-col items-center">
            <div className="w-full aspect-square rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex justify-center items-center p-6 bg-white rounded-lg">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Limit to the first 3 categories for display, with "See All" as the 4th item
  const displayCategories = categories.slice(0, 3);

  return (
    <div className="h-full w-full grid grid-cols-4 gap-6 py-4 px-6 rounded-lg bg-white">
      {displayCategories.map((category) => (
        <ServiceCategoryCard
          key={category.id}
          iconSrc={category.imageURL}
          bgColor={category.bgColor}
          imageAltText={category.name}
          text={category.name}
          height={24}
          width={24}
        />
      ))}
      <Link href="/user/dashboard/category">
        <div className="h-full w-full flex flex-col items-center">
          <div
            style={{ backgroundColor: "#ECECEC" }}
            className={`w-full aspect-square rounded-full flex justify-center items-center ${"#ECECEC"}`}
          >
            <div className="w-1/3 aspect-square relative rounded-full object-cover overflow-hidden">
              <Image src="/Icon/right_arrow.png" alt="right arrow" fill/>
            </div>
          </div>
          <p className="text-xs mt-2">See All</p>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCategoryList;
