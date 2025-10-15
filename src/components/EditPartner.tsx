"use client";

import React, { useState } from "react";
import Link from "next/link";

const EditPartner: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "6969696969",
    address: "",
    aadhar: "",
    status: "Active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (status: string) => {
    setFormData({ ...formData, status });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Partner Data:", formData);
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
              <li className="p-3 border-l-4 border-red-300 flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <Link href="/admin/AdminUsers" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/admin.png" alt="Admin Icon" className="w-6 h-6" />
                  <span>Admin</span>
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 rounded">5</span>
                </Link>
              </li>

              <li className="bg-red-300 text-white p-3 rounded-md flex items-center space-x-2">
                <a href="/admin/Partners/PartnerUsers" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/partner.png" alt="Partners Icon" className="w-6 h-6" />
                  <span>Partners</span>
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">Home &gt; Partners &gt; Edit</div>
          <h2 className="text-2xl font-bold mb-4">Edit Partner</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md w-1/2">
            <label className="block mb-2 font-semibold">Name :</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" />

            <label className="block mb-2 font-semibold">Mobile Number :</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" />

            <label className="block mb-2 font-semibold">Address :</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" />

            <label className="block mb-2 font-semibold">Aadhar Number:</label>
            <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} className="w-full p-2 border rounded-md mb-4" />

            <label className="block mb-2 font-semibold">Status :</label>
            <div className="flex items-center mb-4">
              <input type="radio" name="status" value="Active" checked={formData.status === "Active"} onChange={() => handleStatusChange("Active")} className="mr-2" />
              <span>Active</span>
              <input type="radio" name="status" value="Inactive" checked={formData.status === "Inactive"} onChange={() => handleStatusChange("Inactive")} className="ml-6 mr-2" />
              <span>Inactive</span>
            </div>

            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md">Edit Partner</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditPartner;
