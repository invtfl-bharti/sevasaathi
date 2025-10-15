// components/ServiceList.js
import Image from "next/image";
import { MapPin, Calendar, User } from "lucide-react";

interface Service {
  id: string;
  image?: string;
  title: string;
  price: number;
  discount?: string;
  location?: string;
  date?: string;
  time?: string;
  provider?: string;
}

interface ServiceListProps {
  services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
  return (
    <div className="space-y-4 border-2 p-2">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm border"
        >
          {service.image && (
            <div className="relative h-40 w-full">
              <Image
                src={service.image}
                alt={service.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium">{service.title}</h3>
              {service.id && (
                <span className="bg-lightpurple text-white rounded-full px-3 py-1 text-sm">
                  #{service.id}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-semibold text-lightpurple">
                ₹{service.price}
              </span>
              {service.discount && (
                <span className="text-green4 text-sm font-semibold">
                  {service.discount}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 text-[#6C757D]">
              {service.location && (
                <div className="flex items-start space-x-2 text-gray-600 mb-1">
                  <MapPin size={18} className="flex-shrink-0 mt-1 text-black" />
                  <span className="text-sm">{service.location}</span>
                </div>
              )}
              {service.date && (
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Calendar size={18} className="flex-shrink-0 text-black" />
                  <span className="text-sm">
                    {service.date} {service.time}
                  </span>
                </div>
              )}
              {service.provider && (
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <User size={18} className="flex-shrink-0 text-black" />
                  <span className="text-sm">{service.provider}</span>
                </div>
              )}
            </div>

            <div className="pt-3 flex space-x-2 border-t-2">
              <button className="bg-lightpurple text-white rounded py-2 px-4 flex-1 font-medium">
                Accept
              </button>
              <button className="bg-slate-200 text-gray-800 rounded py-2 px-4 flex-1 font-medium">
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
