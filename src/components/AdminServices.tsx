import React from "react";
import { FaUsers, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

const AdminServices: React.FC = () => {
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
                <img src="/Icon/dash.png" alt="Dashboard Icon" className="w-6 h-6" />
                <span>Dashboard</span>
              </li>
              <h2 className="text-gray-500 text-sm font-semibold mt-4 mb-2">User Details</h2>
              <li className="p-3 border-l-4 border-red-300 flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <Link href="/admin/AdminUsers" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/admin.png" alt="Admin Icon" className="w-6 h-6" />
                  <span>Admin</span>
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 rounded">5</span>
                </Link>
              </li>
              <li className="p-3 border-l-4 border-red-300 flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <Link href="/admin/Partners/PartnerUsers" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/partner.png" alt="Partners Icon" className="w-6 h-6" />
                  <span>Partners</span>
                  <span className="ml-auto bg-green4 text-white text-xs px-2 rounded">5</span>
                </Link>
              </li>
              <li className="bg-red-300 text-white p-3 rounded-md flex items-center space-x-2 transition-all duration-300 hover:bg-red-100 hover:scale-105 cursor-pointer">
                <Link href="/admin/Serv" className="flex items-center space-x-2 w-full">
                  <img src="/Icon/services.png" alt="Services Icon" className="w-6 h-6" />
                  <span>Services</span>
                  <span className="ml-auto bg-gray-500 text-white text-xs px-2 rounded"></span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            Home &gt; Services &gt;
          </div>

        {/* Services List */}
        <div className="grid grid-cols-2 gap-8">
          {/* AC Check-Up (Pending) */}
          <div className="bg-red-100 p-4 rounded shadow-md">
            <h3 className="text-lg font-bold flex items-center">
              <span className="mr-2">🛠</span> AC Check-Up
            </h3>
            <p className="text-gray-500 text-sm">Reference Code: #D-571224</p>

            <p className="mt-2 text-sm font-bold">Status <span className="ml-2 text-yellow-600 bg-yellow-200 px-2 py-1 text-xs rounded">Pending</span></p>

            <p className="text-gray-500 text-sm mt-1">📅 10:00-11:00 AM, 26 Apr</p>

            {/* Buttons */}
            <div className="mt-4 flex space-x-2">
              <button className="bg-purple1 text-white px-4 py-2 rounded flex-1">Assign</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded flex-1">Call</button>
            </div>
          </div>

          {/* Pipe Cleaning (Confirmed) */}
          <div className="bg-green-100 p-4 rounded shadow-md">
            <h3 className="text-lg font-bold flex items-center">
              <span className="mr-2">🛠</span> Pipe Cleaning
            </h3>
            <p className="text-gray-500 text-sm">Reference Code: #D-571224</p>

            <p className="mt-2 text-sm font-bold">Status <span className="ml-2 text-green-600 bg-green-200 px-2 py-1 text-xs rounded">Confirmed</span></p>

            <p className="text-gray-500 text-sm mt-1">📅 00:00-01:00 AM, 14 Feb</p>

            <p className="text-sm font-bold mt-2">⚡ Srijan Maurya</p>
            <p className="text-gray-500 text-xs">Assigned</p>

            {/* Buttons */}
            <div className="mt-4 flex">
              <button className="bg-green4 text-white px-4 py-2 rounded flex-1">Call</button>
            </div>
          </div>
        </div>

        </main>
      </div>
    </div>
  );
};

export default AdminServices;
