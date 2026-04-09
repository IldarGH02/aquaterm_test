import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';

import { SERVICES } from '@shared/constants';
import { Section } from "@shared/ui/Section"
import { ServicesList } from '@widgets/Services/ui/SevicesList.tsx';

interface ServicesProps {
  onCtaClick: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onCtaClick }) => {
  const [activeTab, setActiveTab] = useState(SERVICES[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const activeService = SERVICES.find(s => s.id === activeTab) || SERVICES[0];

  const handleTabChange = (id: string) => {
    if (id === activeTab) return;
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    setIsTransitioning(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveTab(id);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200';
    e.currentTarget.className = "w-full h-full object-cover opacity-50 bg-gradient-to-br from-[#1a224f] to-[#d71e1e]";
  };

  return (
      <Section
          id="services"
          className="reveal scroll-mt-28 bg-white py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4 md:gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 sm:mb-4">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-[#d71e1e] animate-ping"></div>
                <span>Инженерные решения</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a224f] mb-4 sm:mb-6 uppercase tracking-tight">
                НАПРАВЛЕНИЯ <span className="text-[#d71e1e]">СЕРВИСА</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Высокотехнологичный подход к комфорту. Используем современные
                материалы и передовое оборудование от мировых лидеров.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
            <ServicesList items={SERVICES} activeTab={activeTab} handleTabChange={handleTabChange}/>
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(26,34,79,0.15)] overflow-hidden border border-gray-100 transition-all duration-500">
            <div className="grid lg:grid-cols-2">
              {/* Content Panel */}
              <div className={`p-4 sm:p-6 md:p-10 lg:p-20 flex flex-col justify-center transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}`}>
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="w-4 sm:w-6 h-0.5 sm:h-1 bg-[#d71e1e] rounded-full"></div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#1a224f] uppercase tracking-wider">{activeService.title}</h3>
                </div>

                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-4 sm:mb-6 md:mb-8 font-bold leading-snug line-clamp-2">
                  {activeService.shortDesc}
                </p>

                <button
                    onClick={() => setExpandedService(expandedService === activeService.id ? null : activeService.id)}
                    className="flex items-center text-[#1a224f] font-bold text-sm sm:text-base mb-4 sm:mb-6 md:mb-8 hover:text-[#d71e1e] transition-colors self-start"
                >
                  {expandedService === activeService.id ? 'Свернуть' : 'Подробнее'}
                  <ChevronDown className={`ml-1 transition-transform duration-300 ${expandedService === activeService.id ? 'rotate-180' : ''}`} size={18} />
                </button>

                {expandedService === activeService.id && (
                    <p className="text-gray-700 mb-6 md:mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
                      {activeService.offer}
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
                  {(expandedService === activeService.id ? activeService.works : activeService.works.slice(0, 3)).map((item: any, idx: any) => (
                      <div key={idx} className="flex items-start text-gray-700 font-medium group/item gap-2 sm:gap-2.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors group-hover/item:bg-[#d71e1e] group-hover/item:text-white mt-0.5">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-xs sm:text-sm uppercase leading-tight">{item}</span>
                      </div>
                  ))}
                </div>

                <button
                    onClick={onCtaClick}
                    className="w-full bg-[#1a224f] hover:bg-[#2a3575] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center group shadow-lg active:scale-95 min-h-[44px] text-sm sm:text-base"
                >
                  Заказать решение за 15 минут
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>

              {/* Image Panel */}
              <div className="relative min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-auto bg-[#1a224f] overflow-hidden group/visual aspect-[4/3] lg:aspect-auto">
                <div className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>

                  <img
                      src={activeService.imageUrl}
                      alt={activeService.title}
                      onError={handleImageError}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[0.1] brightness-90 transition-transform duration-[3000ms] group-hover/visual:scale-105"
                      style={{
                        minHeight: '300px'
                      }}
                      width={1200}
                      height={675}
                  />

                  {/* Дополнительное изображение */}
                  <img
                      src="/1.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                      width={1200}
                      height={675}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
  );
};
