"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import HeaderWithBackButton from "@/components/HeaderWithBackButton";
import ButtonNavigation from "@/components/ButtonNavigation";

interface Service {
  id: string;
  name: string;
  description: string;
  amount: number;
  imageURL: string | null;
  serviceCategory: {
    id: string;
    name: string;
  };
}

interface SelectedService {
  id: string;
  name: string;
  unitCount: number;
  pricePerUnit: number;
}

const ServicesByCategory = ({ params }: { params: { categoryId: string } }) => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [showUnitSelector, setShowUnitSelector] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const categoryId = params.categoryId;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services?categoryId=${categoryId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        setServices(data);
        
        // Set category name from the first service if available
        if (data.length > 0) {
          setCategoryName(data[0].serviceCategory.name);
        } else {
          // Fetch category name separately if no services
          const categoryResponse = await fetch(`/api/service-categories/${params.categoryId}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategoryName(categoryData.name);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  // Calculate total amount whenever selected services change
  useEffect(() => {
    const total = selectedServices.reduce(
      (sum, service) => sum + (service.pricePerUnit * service.unitCount), 
      0
    );
    setTotalAmount(total);
  }, [selectedServices]);

  const toggleServiceSelection = (service: Service) => {
    const isSelected = selectedServices.some(item => item.id === service.id);
    
    if (isSelected) {
      // Remove from selection
      setSelectedServices(prev => prev.filter(item => item.id !== service.id));
    } else {
      // Show unit selector for this service
      setShowUnitSelector(service.id);
    }
  };

  const handleUnitConfirm = (serviceId: string, units: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    setSelectedServices(prev => [
      ...prev,
      {
        id: service.id,
        name: service.name,
        unitCount: units,
        pricePerUnit: service.amount
      }
    ]);
    
    setShowUnitSelector(null);
  };

  const handleUnitCancel = () => {
    setShowUnitSelector(null);
  };

  const handleProceed = () => {
    if (selectedServices.length === 0) {
      return; // Don't proceed if no services selected
    }
    
    // Navigate to the schedule service page with selected services data
    const servicesData = encodeURIComponent(JSON.stringify(selectedServices));
    const url = `/user/dashboard/services/schedule?services=${servicesData}&totalAmount=${totalAmount}`;
    console.log("Attempting to navigate to:", url);
    try {
      router.push(url);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <HeaderWithBackButton title="Loading..." />
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <HeaderWithBackButton title="Error" />
        <div className="mt-10 flex justify-center">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <HeaderWithBackButton title={`${categoryName} Services`} />
        </div>
        
        {selectedServices.length > 0 && (
          <div className="px-4 py-2 bg-green1 border-t border-b border-green-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{selectedServices.length}</span> services selected
              </p>
              <p className="text-green4 font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>
            <button
              onClick={handleProceed}
              className="px-5 py-2 bg-green4 text-white font-medium rounded-lg shadow-sm hover:bg-green4 transition"
            >
              Proceed
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {services.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center justify-center">
            <Image
              src="/empty-state.svg"
              alt="No services"
              width={120}
              height={120}
              className="opacity-60 mb-4"
            />
            <p className="text-gray-500 text-center">No services available for this category</p>
          </div>
        ) : (
          services.map((service) => {
            const isSelected = selectedServices.some(item => item.id === service.id);
            const selectedService = selectedServices.find(item => item.id === service.id);
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  isSelected ? 'border-2 border-green3' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={service.imageURL || "/service-placeholder.jpg"}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-green3 rounded-full flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-green4 font-bold">₹{service.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">per unit</p>
                      </div>
                      
                      {isSelected ? (
                        <div className="flex items-center gap-2">
                          <span className="bg-green1 text-green4 px-3 py-1 rounded-lg text-sm font-medium">
                            {selectedService?.unitCount} unit{selectedService?.unitCount !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => toggleServiceSelection(service)}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleServiceSelection(service)}
                          className="px-4 py-1.5 bg-purple1 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Unit selector modal */}
      <AnimatePresence>
        {showUnitSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-5 m-4 max-w-sm w-full shadow-xl"
            >
              <UnitSelector 
                serviceId={showUnitSelector}
                serviceName={services.find(s => s.id === showUnitSelector)?.name || ""}
                onConfirm={handleUnitConfirm}
                onCancel={handleUnitCancel}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed h-16 w-full bottom-0 left-0 right-0 z-10">
        <ButtonNavigation />
      </div>
    </div>
  );
};

interface UnitSelectorProps {
  serviceId: string;
  serviceName: string;
  onConfirm: (serviceId: string, units: number) => void;
  onCancel: () => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ serviceId, serviceName, onConfirm, onCancel }) => {
  const [units, setUnits] = useState(1);
  
  const handleIncrease = () => {
    setUnits(prev => Math.min(prev + 1, 10)); // Maximum 10 units
  };
  
  const handleDecrease = () => {
    setUnits(prev => Math.max(prev - 1, 1)); // Minimum 1 unit
  };
  
  return (
    <div>
      <h3 className="text-lg font-bold text-center mb-4">{serviceName}</h3>
      <p className="text-center text-gray-600 mb-6">How many units do you need?</p>
      
      <div className="flex items-center justify-center mb-6">
        <button 
          onClick={handleDecrease}
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold"
          disabled={units <= 1}
        >
          -
        </button>
        <div className="mx-6 text-2xl font-bold">{units}</div>
        <button 
          onClick={handleIncrease}
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold"
          disabled={units >= 10}
        >
          +
        </button>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-300 rounded-xl font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(serviceId, units)}
          className="flex-1 py-3 bg-purple1 text-white rounded-xl font-medium"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ServicesByCategory;