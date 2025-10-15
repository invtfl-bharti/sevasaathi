import React from "react";
import { FaUsers, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

const AdminDashboard: React.FC = () => {
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
            <li className="bg-red-300 text-white p-3 rounded-md flex items-center space-x-2">
                <img src="/Icon/dash.png" alt="Dashboard Icon" className="w-6 h-6" />
                <span>Dashboard</span>
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
                    <span className="ml-auto bg-gray text-white text-xs px-2 rounded">2</span>
                </a>
                </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            Home &gt; Dashboard &gt;
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 shadow rounded-md">
              <FaClipboardList className="text-red-500 text-2xl mx-auto" />
              <h2 className="text-2xl font-bold mt-2">12</h2>
              <p className="text-gray-600">Requests</p>
            </div>
            <div className="bg-white p-4 shadow rounded-md">
              <FaUsers className="text-blue-500 text-2xl mx-auto" />
              <h2 className="text-2xl font-bold mt-2">15</h2>
              <p className="text-gray-600">Partners</p>
            </div>
            <div className="bg-white p-4 shadow rounded-md">
              <FaCheckCircle className="text-green-500 text-2xl mx-auto" />
              <h2 className="text-2xl font-bold mt-2">3</h2>
              <p className="text-gray-600">Assigned</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center space-x-4 mt-6">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 p-2 border rounded-md"
            />
            <select className="p-2 border rounded-md">
              <option>All</option>
            </select>
            <select className="p-2 border rounded-md">
              <option>All Departments</option>
            </select>
          </div>

          {/* User Table */}
          <div className="mt-6 bg-white shadow-md rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Field of Work</th>
                  <th className="p-3">Activity</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Yuvraj Singh",
                    status: "Active",
                    phone: "+91 6969696969",
                    work: "Washing Machine Repair, AC Repair",
                  },
                  {
                    name: "Pranay Shaurya",
                    status: "Active",
                    phone: "+91 6969696969",
                    work: "AC Repair, TV Repair",
                  },
                  {
                    name: "Srijan Maurya",
                    status: "Active",
                    phone: "+91 6969696969",
                    work: "Electrician, Plumber, Firefighter",
                  },
                ].map((user, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3 flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                      {user.name}
                    </td>
                    <td className="p-3">{user.status}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.work}</td>
                    <td className="p-3 text-blue-600 cursor-pointer">
                      Assigned
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;