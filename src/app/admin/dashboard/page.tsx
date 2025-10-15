// pages/dashboard.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, ChevronDown, User, Menu } from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data for the dashboard
  const stats = [
    { title: 'Requests', count: 12 },
    { title: 'Partners', count: 15 },
    { title: 'Assigned', count: 3 },
  ];
  
  const serviceProviders = [
    {
      id: 1,
      name: 'Yuvraj Singh',
      status: 'Active',
      phone: '+91 6969696969',
      fieldOfWork: 'Washing Machine Repair, AC Repair',
      activity: 'Assigned'
    },
    {
      id: 2,
      name: 'Pranay Shaurya',
      status: 'Active',
      phone: '+91 6969696969',
      fieldOfWork: 'AC Repair, TV Repair',
      activity: 'Assigned'
    },
    {
      id: 3,
      name: 'Srijan Maurya',
      status: 'Active',
      phone: '+91 6969696969',
      fieldOfWork: 'Electrician, Plumber, Firefighter',
      activity: 'Assigned'
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Head>
        <title>Seva Sathi - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10">
              <svg viewBox="0 0 100 100" className="text-blue-600">
                <path d="M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 Z M50,80 C35,80 20,65 20,50 C20,35 35,20 50,20 C65,20 80,35 80,50 C80,65 65,80 50,80 Z" fill="currentColor" />
                <path d="M30,40 L45,55 L45,30 L30,45 Z M55,45 L70,30 L55,30 Z M55,55 L70,70 L55,70 Z M45,70 L30,60 L45,45 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="ml-2">
              <h1 className="text-lg font-bold text-blue-700">Seva Sathi</h1>
              <p className="text-xs text-gray-600">Empowering Rural Services</p>
            </div>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-gray-200 md:relative fixed inset-0 z-10`}>
        <div className="p-4 border-b border-gray-200 hidden md:block">
          <div className="flex items-center">
            <div className="w-12 h-12">
              <svg viewBox="0 0 100 100" className="text-blue-600">
                <path d="M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 Z M50,80 C35,80 20,65 20,50 C20,35 35,20 50,20 C65,20 80,35 80,50 C80,65 65,80 50,80 Z" fill="currentColor" />
                <path d="M30,40 L45,55 L45,30 L30,45 Z M55,45 L70,30 L55,30 Z M55,55 L70,70 L55,70 Z M45,70 L30,60 L45,45 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="ml-2">
              <h1 className="text-xl font-bold text-blue-700">Seva Sathi</h1>
              <p className="text-xs text-gray-600">Empowering Rural Services</p>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <div className="md:hidden p-4 flex justify-end">
          <button onClick={toggleSidebar} className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <Link href="/dashboard" className="flex items-center p-3 bg-red-200 text-red-700 rounded-md">
              <span className="mr-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </span>
              Dashboard
            </Link>
          </div>

          <div className="mb-2 text-sm font-medium text-gray-600">User Details</div>
          
          <div className="mb-2 border-l-2 border-red-400">
            <Link href="/admin" className="flex items-center pl-2 py-2 text-gray-700 hover:bg-gray-100 rounded">
              <User size={18} className="mr-2" />
              Admin <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">8</span>
            </Link>
          </div>
          
          <div className="mb-2 border-l-2 border-red-400">
            <Link href="/partners" className="flex items-center pl-2 py-2 text-gray-700 hover:bg-gray-100 rounded">
              <User size={18} className="mr-2" />
              Partners <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">15</span>
            </Link>
          </div>
          
          <div className="mb-2 border-l-2 border-red-400">
            <Link href="/services" className="flex items-center pl-2 py-2 text-gray-700 hover:bg-gray-100 rounded">
              <User size={18} className="mr-2" />
              Services <span className="ml-2 px-2 py-0.5 bg-gray-700 text-white text-xs rounded-full">12</span>
            </Link>
          </div>

          <div className="mb-2 border-l-2 border-red-400">
            <Link href="/admin/forms/service-category" className="flex items-center pl-2 py-2 text-gray-700 hover:bg-gray-100 rounded">
              <User size={18} className="mr-2" />
              ADD Service Category <span className="ml-2 px-2 py-0.5 bg-gray-700 text-white text-xs rounded-full">12</span>
            </Link>
          </div>

          <div className="mb-2 border-l-2 border-red-400">
            <Link href="/admin/forms/service" className="flex items-center pl-2 py-2 text-gray-700 hover:bg-gray-100 rounded">
              <User size={18} className="mr-2" />
              ADD Service <span className="ml-2 px-2 py-0.5 bg-gray-700 text-white text-xs rounded-full">12</span>
            </Link>
          </div>
          
        </div>
      </aside>

      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Header with breadcrumbs */}
        <div className="bg-red-50 p-4 border-b border-gray-200">
          <div className="text-sm breadcrumbs">
            <ul className="flex flex-wrap">
              <li><Link href="/" className="text-red-600">Home</Link> &gt;</li>
              <li><Link href="/dashboard" className="text-red-600 ml-2">Dashboard</Link> &gt;</li>
            </ul>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-4 md:p-6 border border-gray-200 rounded text-center"
              >
                <div className="text-4xl md:text-6xl font-semibold text-gray-800">{stat.count}</div>
                <div className="text-gray-500 mt-2">{stat.title}</div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="mb-6">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded text-gray-700">
                  All <ChevronDown size={16} className="ml-2" />
                </button>
              </div>
              
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded text-gray-700">
                  All Departments <ChevronDown size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field of Work</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-full"></div>
                        <div className="ml-2 md:ml-4">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{provider.status}</span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{provider.phone}</span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{provider.fieldOfWork}</span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-purple-600 font-medium">{provider.activity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}