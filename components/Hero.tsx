
import React from 'react';
import { Shield, Settings, Wrench } from 'lucide-react';

interface HeroProps {
  onCtaPrimary: () => void;
  onCtaSecondary: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaPrimary, onCtaSecondary }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 sm:pt-24 overflow-x-hidden bg-[#1a224f]">
      {/* Background Graphic elements mimicking the car wrap */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d71e1e] skew-x-[-12deg] translate-x-1/4 opacity-10 md:opacity-100 hidden md:block"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-white">
            <div className="inline-block bg-[#d71e1e] px-3 sm:px-4 py-1 mb-4 sm:mb-6 text-xs font-bold uppercase tracking-[0.3em] animate-in fade-in slide-in fade-in slide-in-from-left duration-700">
              Отопление, вода и очистка в Орле — под ключ
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 sm:mb-4 tracking-tight">
              ИНЖЕНЕРНЫЕ СИСТЕМЫ <br className="hidden sm:block" />
              ДЛЯ ДОМА И БИЗНЕСА <br className="hidden sm:block" />
              <span className="text-[#d71e1e]">ПОД КЛЮЧ</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-4 sm:mb-6 max-w-md leading-relaxed">
              По договору, с фиксированной сметой и гарантией
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-blue-100/80">
              <span className="flex items-center"><Settings className="mr-2 text-[#d71e1e]" size={18} /> Проектирование</span>
              <span className="hidden sm:flex items-center"><Wrench className="mr-2 text-[#d71e1e]" size={18} /> Монтаж</span>
              <span className="hidden sm:flex items-center"><Shield className="mr-2 text-[#d71e1e]" size={18} /> Обслуживание</span>
            </div>
            
            <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-10 max-w-lg leading-relaxed border-l-4 border-[#d71e1e] pl-4">
              Комплектуем и монтируем надежные котельные и системы водоочистки в Орле. 
              <span className="text-white font-bold block mt-2">Официальная гарантия, свой склад запчастей и сервис 24/7.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <button 
                onClick={onCtaPrimary}
                className="bg-[#d71e1e] hover:bg-[#b01818] text-white px-6 sm:px-10 py-4 sm:py-5 rounded font-black uppercase tracking-widest shadow-2xl transition-all transform hover:-translate-y-1 hover:shadow-red-900/50 active:scale-95 min-h-[44px] w-full sm:w-auto flex items-center justify-center"
              >
                Рассчитать смету
              </button>
              <button
                onClick={onCtaSecondary}
                className="bg-white hover:bg-gray-100 text-[#1a224f] px-6 sm:px-10 py-4 sm:py-5 rounded font-black uppercase tracking-widest shadow-xl transition-all hover:bg-opacity-90 active:scale-95 min-h-[44px] w-full sm:w-auto flex items-center justify-center"
              >
                Вызвать инженера
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-8 text-[10px] sm:text-xs font-bold text-blue-200">
              <div className="flex items-center"><Shield className="mr-2 text-green-400" size={16} /> АВТОРИЗОВАННЫЙ СЕРВИС BAXI</div>
              <div className="flex items-center"><Wrench className="mr-2 text-green-400" size={16} /> ОПЫТ РАБОТЫ 12 ЛЕТ</div>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-1000">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
            <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-3xl overflow-hidden shadow-2xl transform rotate-y-12 transition-transform duration-500 hover:rotate-y-0">
                <img
                  src="/1.png"
                  alt="Инженерные системы отопления и водоснабжения"
                  loading="lazy"
                  className="rounded-2xl opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 w-full object-cover aspect-[16/10] sm:aspect-[16/9]"
                  width={1200}
                  height={675}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 bg-[#1a224f]/90 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-l-4 border-[#d71e1e] shadow-2xl max-w-[calc(100%-1.5rem)] sm:max-w-xs">
                    <div className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1">5000+</div>
                    <div className="text-[10px] sm:text-xs text-blue-200 font-bold uppercase tracking-widest leading-none mb-1 sm:mb-2">довольных клиентов</div>
                    <p className="text-[10px] sm:text-xs text-blue-100 leading-tight hidden sm:block">От замены крана до промышленных котельных.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
