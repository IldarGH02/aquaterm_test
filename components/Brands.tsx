
import React from 'react';
import { BRANDS } from '../constants';

const Brands: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-gray-100 overflow-hidden py-10">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Официальные партнеры и авторизованный сервис
        </p>
      </div>
      
      {/* Marquee effect container */}
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-16 px-8">
          {[...BRANDS, ...BRANDS].map((brand, idx) => (
            <span 
              key={idx} 
              className="text-3xl md:text-5xl font-black text-gray-200 uppercase tracking-tighter hover:text-[#1a224f] transition-colors duration-300 cursor-default select-none"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Brands;
