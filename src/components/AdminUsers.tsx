"use client";

import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminUsers: React.FC = () => {
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/admin/EditAdmin?id=${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      console.log(`User with ID ${id} deleted`);
      // Implement the actual delete logic here
    }
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
            Home &gt; Admin &gt;
          </div>

          {/* Search & Add */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search"
              className="p-2 border rounded-md w-1/3"
            />
            <Link 
                href="/admin/AddAdmin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                <FaPlus className="text-white" />
                <span>Add</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="text-red-600 mb-4 cursor-pointer">All (5)</div>

          {/* User Table */}
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">USERNAME</th>
                  <th className="p-3">EMAIL</th>
                  <th className="p-3">PHONE</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">CREATE DATE</th>
                  <th className="p-3">UPDATE DATE</th>
                  <th className="p-3">MODIFY</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((id) => (
                  <tr key={id} className="border-t">
                    <td className="p-3">{id}</td>
                    <td className="p-3">User_{id}</td>
                    <td className="p-3">harsh70mahajan@gmail.com</td>
                    <td className="p-3">6969696969</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md">Active</span>
                    </td>
                    <td className="p-3">2023-03-12 12:24:22 AM</td>
                    <td className="p-3">2023-03-12 12:24:22 AM</td>
                    <td className="p-3 flex space-x-2">
                      <button className="text-yellow-600" onClick={() => handleEdit(id)}>
                        <FaEdit />
                      </button>
                      <button className="text-red-600" onClick={() => handleDelete(id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
