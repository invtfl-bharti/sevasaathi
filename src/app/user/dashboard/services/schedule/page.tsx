"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import ButtonNavigation from "@/components/ButtonNavigation";
import toast from "react-hot-toast";

interface SelectedService {
  id: string;
  name: string;
  unitCount: number;
  pricePerUnit: number;
}

interface Address {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

const ScheduleServicePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicesParam = searchParams.get("services");
  const totalAmountParam = searchParams.get("totalAmount");

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [addressType, setAddressType] = useState<"existing" | "new" | "current">("existing");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [newAddressName, setNewAddressName] = useState("");
  const [newAddressText, setNewAddressText] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocationAddress, setCurrentLocationAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Parse services from URL params
  useEffect(() => {
    if (servicesParam) {
      try {
        const services = JSON.parse(decodeURIComponent(servicesParam));
        setSelectedServices(services);
      } catch (error) {
        console.error("Error parsing services:", error);
        toast.error("Invalid service data");
        router.push("/dashboard/services");
      }
    }

    if (totalAmountParam) {
      setTotalAmount(parseFloat(totalAmountParam));
    }
  }, [servicesParam, totalAmountParam, router]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await fetch("/api/user/addresses");
        
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        
        const data = await response.json();
        
        if (data.success && data.addresses) {
          setAddresses(data.addresses);
          // Set default address if available
          const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (data.addresses.length > 0) {
            setSelectedAddressId(data.addresses[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Could not load saved addresses");
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }
    
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Call our API to get address from coordinates
          const response = await fetch(
            `/api/location/geocoding?latitude=${latitude}&longitude=${longitude}`
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch address from coordinates");
          }
          
          const data = await response.json();
          
          if (data.success && data.address) {
            setCurrentLocationAddress(data.address.formattedAddress);
            setAddressType("current");
          } else {
            toast.error("Could not determine your address");
          }
        } catch (error) {
          console.error("Error getting address from location:", error);
          toast.error("Failed to get your address");
        }
        
        setIsGettingLocation(false);
      }, (error) => {
        console.error("Geolocation error:", error);
        toast.error("Could not access your location");
        setIsGettingLocation(false);
      });
    } catch (error) {
      console.error("Geolocation error:", error);
      toast.error("Could not access your location");
      setIsGettingLocation(false);
    }
  };

  const handleAddNewAddress = async () => {
    if (!newAddressName || !newAddressText) {
      toast.error("Please provide both name and address");
      return;
    }
    
    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newAddressName,
          address: newAddressText,
          isDefault: isDefaultAddress,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add address");
      }
      
      const data = await response.json();
      
      if (data.success && data.address) {
        toast.success("Address added successfully");
        
        // Add the new address to our list and select it
        setAddresses([data.address, ...addresses]);
        setSelectedAddressId(data.address.id);
        setAddressType("existing");
        
        // Clear the form
        setNewAddressName("");
        setNewAddressText("");
        setIsDefaultAddress(false);
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to save address");
    }
  };

  const handleContinue = () => {
    // Validate required fields
    if (addressType === "existing" && !selectedAddressId) {
      toast.error("Please select an address");
      return;
    }
    
    if (addressType === "new" && (!newAddressName || !newAddressText)) {
      toast.error("Please provide both name and address");
      return;
    }
    
    if (addressType === "current" && !currentLocationAddress) {
      toast.error("Please get your current location");
      return;
    }
    
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }
    
    // Combine date and time into a single datetime
    const dateTime = new Date(date);
    dateTime.setHours(time.getHours());
    dateTime.setMinutes(time.getMinutes());
    
    // Get the selected address details
    let addressDetails = null;
    
    if (addressType === "existing") {
      addressDetails = addresses.find(addr => addr.id === selectedAddressId);
    } else if (addressType === "new") {
      addressDetails = {
        name: newAddressName,
        address: newAddressText,
        isNew: true,
        isDefault: isDefaultAddress
      };
    } else if (addressType === "current") {
      addressDetails = {
        name: "Current Location",
        address: currentLocationAddress,
        isCurrent: true
      };
    }
    
    if (!addressDetails) {
      toast.error("Please select or enter an address");
      return;
    }
    
    // Create data object for the next page
    const bookingData = {
        services: selectedServices,
        totalAmount,
        dateTime: dateTime.toISOString(),
        description,
        address: addressDetails
      };
    
    // Navigate to summary page with data
    const encodedData = encodeURIComponent(JSON.stringify(bookingData));
    router.push(`/user/dashboard/services/summary?data=${encodedData}`);
  };

  // Functions to filter and set times
  const filterTime = (time: Date) => {
    const hours = time.getHours();
    return hours >= 8 && hours <= 20; // Allow time between 8 AM and 8 PM
  };
  
  const handleSelectTime = (time: Date | null) => {
      if (!time) return; // Handle null case gracefully
  
      // Round to nearest 30 minutes
      const minutes = time.getMinutes();
      const roundedMinutes = minutes < 30 ? 0 : 30;
  
      const roundedTime = new Date(time);
      roundedTime.setMinutes(roundedMinutes);
      roundedTime.setSeconds(0);
      roundedTime.setMilliseconds(0);
  
      setTime(roundedTime);
  };
  
  // Minimum date is today
  const minDate = new Date();
  
  // Maximum date is 30 days from now
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  // If we don't have services data, show loading
  if (selectedServices.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <HeaderWithBackButton title="Schedule Service" />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No services selected. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <HeaderWithBackButton title="Schedule Service" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Services Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Selected Services</h2>
          <div className="divide-y divide-gray-100">
            {selectedServices.map((service) => (
              <div key={service.id} className="py-2 flex justify-between">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    {service.unitCount} unit{service.unitCount !== 1 ? 's' : ''} × ₹{service.pricePerUnit.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-green4">₹{(service.pricePerUnit * service.unitCount).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
            <p className="font-bold">Total Amount</p>
            <p className="font-bold text-green4">₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Service Address</h2>
          
          <div className="space-y-3">
            {/* Address Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setAddressType("existing")}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  addressType === "existing" ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Saved Address
              </button>
              <button
                onClick={() => setAddressType("new")}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  addressType === "new" ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                New Address
              </button>
              <button
                onClick={() => setAddressType("current")}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  addressType === "current" ? "bg-white shadow-sm" : "text-gray-600"
                }`}
              >
                Current Location
              </button>
            </div>

            {/* Existing Address */}
            {addressType === "existing" && (
              <div className="space-y-3">
                {isLoadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple1"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No saved addresses</p>
                    <button
                      onClick={() => setAddressType("new")}
                      className="mt-2 text-purple1 text-sm font-medium"
                    >
                      Add a new address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-3 rounded-lg border ${
                          selectedAddressId === address.id
                            ? "border-green4 bg-green1"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.address}</p>
                          </div>
                          {selectedAddressId === address.id && (
                            <div className="w-6 h-6 bg-green4 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {address.isDefault && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* New Address */}
            {addressType === "new" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Name
                  </label>
                  <input
                    type="text"
                    value={newAddressName}
                    onChange={(e) => setNewAddressName(e.target.value)}
                    placeholder="Home, Office, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple1 focus:border-purple1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <textarea
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                    placeholder="Enter your full address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple1 focus:border-purple1 h-24"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="makeDefault"
                    checked={isDefaultAddress}
                    onChange={(e) => setIsDefaultAddress(e.target.checked)}
                    className="h-4 w-4 text-purple1 focus:ring-purple1 rounded"
                  />
                  <label htmlFor="makeDefault" className="ml-2 text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
                <button
                  onClick={handleAddNewAddress}
                  className="w-full py-2.5 bg-purple1 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            )}

            {/* Current Location */}
            {addressType === "current" && (
              <div className="space-y-3">
                {currentLocationAddress ? (
                  <div className="p-3 bg-green1 border border-green4 rounded-lg">
                    <p className="font-medium">Current Location</p>
                    <p className="text-sm text-gray-600">{currentLocationAddress}</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Image
                      src="/location-pin.svg" 
                      alt="Location"
                      width={60}
                      height={60}
                      className="mx-auto mb-3 opacity-70"
                    />
                    <p className="text-gray-500 mb-4">We need your permission to access your location</p>
                    <button
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                      className="px-5 py-2.5 bg-purple1 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
                    >
                      {isGettingLocation ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Getting Location...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>Get Current Location</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Date & Time</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Date
              </label>
              <DatePicker
                selected={date}
                onChange={(date: Date | null) => setDate(date)}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple1 focus:border-purple1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Time
              </label>
              <DatePicker
                selected={time}
                onChange={handleSelectTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                filterTime={filterTime}
                placeholderText="Select time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple1 focus:border-purple1"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Services are available from 8 AM to 8 PM</p>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Additional Instructions (Optional)</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any specific instructions for the service provider?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple1 focus:border-purple1 h-24"
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 bg-purple1 text-white font-medium rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
        >
          Continue to Summary
        </button>
      </div>

      <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-10">
        <ButtonNavigation />
      </div>
    </div>
  );
};

export default ScheduleServicePage;