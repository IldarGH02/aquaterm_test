
import React, { useState } from 'react';
import { SERVICES, ICON_MAP } from '../constants';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  onCtaClick: () => void;
}

const Services: React.FC<ServicesProps> = ({ onCtaClick }) => {
  const [activeTab, setActiveTab] = useState(SERVICES[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeService = SERVICES.find(s => s.id === activeTab) || SERVICES[0];

  const handleTabChange = (id: string) => {
    if (id === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(id);
      setIsTransitioning(false);
    }, 300);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200';
    e.currentTarget.className = "w-full h-full object-cover opacity-50 bg-gradient-to-br from-[#1a224f] to-[#d71e1e]";
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs uppercase tracking-[0.3em] mb-4">
             <div className="w-4 h-4 rounded-full border-2 border-[#d71e1e] animate-ping"></div>
             <span>Инженерные решения</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a224f] mb-6 uppercase tracking-tight">
            НАПРАВЛЕНИЯ <span className="text-[#d71e1e]">СЕРВИСА</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Высокотехнологичный подход к комфорту. Используем современные 
            материалы и передовое оборудование от мировых лидеров.
          </p>
        </div>
        <div className="flex space-x-2">
            <div className="w-12 h-1.5 bg-[#d71e1e] rounded-full"></div>
            <div className="w-6 h-1.5 bg-[#1a224f] rounded-full opacity-20"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleTabChange(s.id)}
            className={`flex flex-col items-start p-6 md:p-8 rounded-2xl transition-all duration-500 border-2 text-left group relative overflow-hidden ${
              activeTab === s.id 
                ? 'bg-[#1a224f] border-[#1a224f] text-white shadow-[0_20px_40px_-10px_rgba(26,34,79,0.4)] transform md:-translate-y-2' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-[#d71e1e]'
            }`}
          >
            {activeTab === s.id && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#d71e1e] opacity-10 rounded-full blur-2xl"></div>
            )}
            
            <div className={`mb-4 md:mb-6 p-3 rounded-xl transition-all duration-500 ${
              activeTab === s.id ? 'bg-[#d71e1e] text-white rotate-12 scale-110' : 'bg-gray-100 text-[#1a224f]'
            }`}>
              {ICON_MAP[s.icon]}
            </div>
            <span className="font-black text-base md:text-xl uppercase tracking-wider mb-2">{s.title}</span>
            <span className={`text-[10px] md:text-xs font-bold opacity-60 uppercase tracking-widest ${activeTab === s.id ? 'text-blue-100' : 'text-gray-400'}`}>
              {s.shortDesc}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(26,34,79,0.15)] overflow-hidden border border-gray-100 transition-all duration-500">
        <div className="grid lg:grid-cols-2">
          {/* Content Panel */}
          <div className={`p-8 md:p-16 lg:p-20 flex flex-col justify-center transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="flex items-center space-x-4 mb-6 md:mb-8">
                <div className="w-12 h-1 bg-[#d71e1e] rounded-full"></div>
                <h3 className="text-2xl md:text-3xl font-black text-[#1a224f] uppercase tracking-wider">{activeService.title}</h3>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-800 mb-8 md:mb-10 font-bold leading-tight">
                {activeService.offer}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-12">
                {activeService.works.map((item, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 font-semibold group/item">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3 md:mr-4 transition-colors group-hover/item:bg-[#d71e1e] group-hover/item:text-white">
                        <CheckCircle2 size={16} />
                    </div>
                    <span className="text-xs md:text-sm uppercase tracking-wide">{item}</span>
                  </div>
                ))}
            </div>

            <button 
              onClick={onCtaClick}
              className="w-full md:w-auto bg-[#1a224f] hover:bg-[#2a3575] text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center group shadow-2xl shadow-blue-900/20 active:scale-95"
            >
              Заказать решение
              <ChevronRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Image Panel */}
          <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-auto bg-[#1a224f] overflow-hidden group/visual">
            <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>

                <img
                  src={activeService.imageUrl}
                  alt={activeService.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover grayscale-[0.1] brightness-90 transition-transform duration-[3000ms] group-hover/visual:scale-105"
                />

                {/* Дополнительное изображение */}
                <img
                  src="/1.png"
                  alt="Дополнительное изображение"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
