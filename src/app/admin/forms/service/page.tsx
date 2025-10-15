"use client";

import React, { useState, useEffect } from "react";

const ServiceForm = () => {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    serviceCategoryId: "",
    amount: 0,
    imageURL: "",
  });

  // Fetch service categories on component mount
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await fetch("/api/service-categories");
        if (!response.ok) {
          throw new Error("Failed to fetch service categories");
        }
        const data = await response.json();
        setServiceCategories(data);
      } catch (err : any) {
        setError("Error loading service categories: " + err.message);
      }
    };

    fetchServiceCategories();
  }, []);

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create service");
      }

      setMessage("Service created successfully!");
      // Reset form
      setFormData({
        name: "",
        description: "",
        serviceCategoryId: "",
        amount: 0,
        imageURL: "",
      });
    } catch (err : any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory :any = serviceCategories.find(
    (cat : any) => cat.id === formData.serviceCategoryId
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Create Service</h2>

      {message && (
        <div className="p-3 mb-4 rounded-md bg-green1 text-green">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 rounded-md bg-red-100 text-red-700">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="serviceCategoryId"
            className="block text-sm font-medium text-gray mb-1"
          >
            Service Category <span className="text-red-500">*</span>
          </label>
          <select
            id="serviceCategoryId"
            name="serviceCategoryId"
            value={formData.serviceCategoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {serviceCategories.map((category : any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="mb-4 p-2 bg-gray-50 rounded text-sm text-gray">
            Creating a service for: <strong>{selectedCategory.name}</strong>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray mb-1"
          >
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AC Installation"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the service..."
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="imageURL"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image URL
          </label>
          <input
            type="url"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;