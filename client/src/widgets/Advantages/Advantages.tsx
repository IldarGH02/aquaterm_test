import { ADVANTAGES } from '@shared/constants';
import { Star } from 'lucide-react';
import { AdvantagesList } from '@widgets/Advantages/ui/AdvantagesList.tsx';

export const Advantages = () => {
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
        <AdvantagesList items={ ADVANTAGES }/>
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
