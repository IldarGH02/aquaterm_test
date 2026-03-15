
import React from 'react';
import { ICON_MAP, ADVANTAGES } from '../constants';
import { Star } from 'lucide-react';

const Advantages: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 md:mb-16">
        <div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 sm:mb-4">
            <Star size={14} fill="currentColor" />
            <span>Ценности компании</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#1a224f] mb-4 sm:mb-6 uppercase tracking-tight leading-tight">
          ПОЧЕМУ <br className="sm:hidden" /> <span className="text-[#d71e1e]">АКВАТЕРМ</span>?
        </h2>
        <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-[#d71e1e] rounded-full mb-4 sm:mb-6"></div>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed">
          15 лет мы создаем комфорт в домах жителей Орловской области, 
          сочетая инженерную точность с искренним сервисом.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20">
        {ADVANTAGES.map((adv, idx) => {
          const IconComponent = ICON_MAP[adv.icon]
          
          return (
            <div key={idx} className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2 relative overflow-hidden">
              {/* Hover Accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#d71e1e] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-[#1a224f]/5 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 text-[#1a224f] group-hover:bg-[#d71e1e] group-hover:text-white transition-colors duration-300">
                {IconComponent && <IconComponent className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8" />}
              </div>
              
              <h3 className="text-base sm:text-lg md:text-xl font-black text-[#1a224f] mb-2 sm:mb-3 group-hover:text-[#d71e1e] transition-colors">
                {adv.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {adv.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Block - Dark Theme */}
      <div className="bg-[#1a224f] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d71e1e] opacity-10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 opacity-5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2"></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center relative z-10">
          <div className="flex flex-col items-center group">
            <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">15<span className="text-[#d71e1e]">+</span></div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-200 leading-tight">Лет на рынке</div>
          </div>
          
          <div className="flex flex-col items-center group relative before:hidden sm:before:content-[''] sm:before:absolute sm:before:left-[-16px] sm:before:top-1/4 sm:before:h-1/2 sm:before:w-[1px] sm:before:bg-white/10">
            <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">5k<span className="text-[#d71e1e]">+</span></div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-200 leading-tight">Проектов сдано</div>
          </div>
          
          <div className="flex flex-col items-center group relative lg:before:content-[''] lg:before:absolute lg:before:left-[-16px] lg:before:top-1/4 lg:before:h-1/2 lg:before:w-[1px] lg:before:bg-white/10">
            <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">10<span className="text-[#d71e1e]">+</span></div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-200 leading-tight">Специалистов</div>
          </div>
          
          <div className="flex flex-col items-center group relative before:hidden sm:before:content-[''] sm:before:absolute sm:before:left-[-16px] sm:before:top-1/4 sm:before:h-1/2 sm:before:w-[1px] sm:before:bg-white/10">
            <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">1</div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-200 leading-tight">Магазин в Орле</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
