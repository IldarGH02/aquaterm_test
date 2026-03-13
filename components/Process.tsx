
import React from 'react';
import { PROCESS_STEPS, ICON_MAP } from '../constants';

const Process: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs uppercase tracking-[0.3em] mb-4">
             <div className="w-4 h-4 rounded-full border-2 border-[#d71e1e] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#d71e1e] rounded-full"></div>
             </div>
             <span>Прозрачная работа</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a224f] mb-6 uppercase tracking-tight">
            КАК МЫ <span className="text-[#d71e1e]">РАБОТАЕМ</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Понятный процесс от звонка до тепла в вашем доме. Никаких скрытых платежей
            и затягивания сроков.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

        {PROCESS_STEPS.map((step, index) => (
          <div key={step.id} className="relative group">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 h-full hover:border-[#d71e1e] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 bg-[#1a224f] text-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-[#d71e1e] transition-colors">
                    {ICON_MAP[step.icon]}
                 </div>
                 <span className="text-6xl font-black text-gray-100 absolute top-2 right-4 -z-0 group-hover:text-gray-50 transition-colors">
                    0{step.id}
                 </span>
              </div>
              
              <h3 className="text-xl font-bold text-[#1a224f] mb-3 relative z-10">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed relative z-10">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Process;
