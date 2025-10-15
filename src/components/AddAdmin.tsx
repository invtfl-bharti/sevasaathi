"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddAdmin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    status: "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Admin Data:", formData);
    // Implement the actual add admin logic here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-50 h-12 mr-3" />
          <div>
            <h1 className="text-blue-900 font-bold text-xl">Seva Sathi</h1>
            <p className="text-gray-500 text-sm">Empowering Rural Services</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-5 border-r">
          <nav>
            <ul className="space-y-3">
            <li className="p-3 border-l-4 border-red-300 flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <Link href="/admin" className="flex items-center space-x-2 w-full">
                    <img src="/Icon/dash.png" alt="Dashboard Icon" className="w-6 h-6" />
                    <span>Dashboard</span>
                </Link>
            </li>

              <h2 className="text-gray-500 text-sm font-semibold mt-4 mb-2">
                User Details
              </h2>
              <li className="bg-red-300 text-white p-3 rounded-md flex items-center space-x-2">
                <Link href="/admin/AdminUsers" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/admin.png" alt="Admin Icon" className="w-6 h-6" />
                  <span>Admin</span>
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 rounded"></span>
                </Link>
              </li>

              <li className="p-3 border-l-4 border-red-300 flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <a href="/admin/Partners/PartnerUsers" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/partner.png" alt="Partners Icon" className="w-6 h-6" />
                  <span>Partners</span>
                  <span className="ml-auto bg-green4 text-white text-xs px-2 rounded">5</span>
                </a>
              </li>

              <li className="p-3 border-l-4 border-red-300 flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <a href="/admin/Serv" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/services.png" alt="Services Icon" className="w-6 h-6" />
                  <span>Services</span>
                  <span className="ml-auto bg-gray1 text-white text-xs px-2 rounded">2</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            Home &gt; Admin &gt; Add Admin
          </div>

          <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6">
            <label className="block text-red-500 font-semibold">Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" required />

            <label className="block text-red-500 font-semibold">Mobile Number:</label>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" required />

            <label className="block text-red-500 font-semibold">Email Address: <span className="text-gray-500">(Login Mail)</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" required />

            <label className="block text-red-500 font-semibold">Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" required />

            <label className="block text-red-500 font-semibold">Status:</label>
            <div className="mb-4">
              <label className="mr-4">
                <input type="radio" name="status" value="active" checked={formData.status === "active"} onChange={handleChange} className="mr-1" /> Active
              </label>
              <label>
                <input type="radio" name="status" value="inactive" checked={formData.status === "inactive"} onChange={handleChange} className="mr-1" /> Inactive
              </label>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md w-50">Add Admin</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
