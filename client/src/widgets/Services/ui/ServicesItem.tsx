import React, { FC } from 'react';
import { ICON_MAP } from '@shared/assets/icons.tsx';

import { ServiceWithImage } from 'src/shared/types';

interface IServicesItemProps {
  service: ServiceWithImage;
  activeTab: number | string;
  handleTabChange: (value: string) => void;
}

export const ServicesItem: FC<IServicesItemProps> = ({service, activeTab, handleTabChange}) => {
  return (
    <button
      key={service.id}
      onClick={() => handleTabChange(service.id)}
      className={`flex flex-col items-start p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 border-2 text-left group relative overflow-hidden min-h-[120px] sm:min-h-[140px] ${
        activeTab === service.id
          ? 'bg-[#1a224f] border-[#1a224f] text-white shadow-lg md:shadow-[0_20px_40px_-10px_rgba(26,34,79,0.4)] transform md:-translate-y-1'
          : 'bg-white border-gray-100 text-gray-700 hover:border-[#d71e1e] hover:shadow-md'
      }`}
    >
      {activeTab === service.id && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#d71e1e] opacity-10 rounded-full blur-2xl"></div>
      )}

      <div className={`mb-2 sm:mb-3 md:mb-4 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
        activeTab === service.id ? 'bg-[#d71e1e] text-white rotate-12 scale-110' : 'bg-gray-100 text-[#1a224f]'
      }`}>
        {React.createElement(ICON_MAP[service.icon], { className: "w-5 h-5 sm:w-6 sm:h-6" })}
      </div>
      <span className="font-black text-xs sm:text-sm md:text-base uppercase leading-tight mb-1">{service.title}</span>
      <span className={`text-xs sm:text-sm font-bold opacity-60 uppercase tracking-wider block ${activeTab === service.id ? 'text-blue-100' : 'text-gray-400'}`}>
              {service.shortDesc}
            </span>
    </button>
  )
}