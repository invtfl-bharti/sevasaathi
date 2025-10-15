import React from 'react';
import { Phone, Calendar, Droplet } from 'lucide-react';

export default function PipeCleaningCard() {
  return (
    <div className="bg-[#E3FFF0] rounded-lg p-4 border border-blue-200 shadow-sm max-w-md">
      <div className="flex items-center mb-4">
        <div className="bg-green-200 p-3 rounded-full mr-3">
          <Droplet className="text-gray-700" size={24} />
        </div>
        <div>
          <h3 className="font-medium text-lg">Pipe Cleaning</h3>
          <p className="text-sm text-gray-500">Reference Code: #D-571224</p>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        <span className="text-sm text-gray-500">Status</span>
        <span className="text-base text-green font-medium">Confirmed</span>
      </div>
      
      <div className="flex items-center mb-4 border-t border-b border-dashed border-blue-200 py-3">
        <div className="bg-gray-100 p-2 rounded-full mr-3">
          <Calendar className="text-gray-500" size={20} />
        </div>
        <div>
          <p className="font-medium">00:00-01:00 AM, 14 Feb</p>
          <p className="text-sm text-gray-500">Schedule</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-gray-700">S</span>
          </div>
          <div>
            <p className="font-medium">Srijan Maurya</p>
            <p className="text-sm text-gray-500">Assigned</p>
          </div>
        </div>
        <button className="bg-green4 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Phone className="mr-2" size={16} />
          Call
        </button>
      </div>
    </div>
  );
}