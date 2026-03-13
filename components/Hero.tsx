
import React from 'react';
import { Shield, Settings, Wrench } from 'lucide-react';

interface HeroProps {
  onCtaPrimary: () => void;
  onCtaSecondary: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaPrimary, onCtaSecondary }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-[#1a224f]">
      {/* Background Graphic elements mimicking the car wrap */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d71e1e] skew-x-[-12deg] translate-x-1/4 opacity-10 md:opacity-100 hidden md:block"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-block bg-[#d71e1e] px-4 py-1 mb-6 text-xs font-bold uppercase tracking-[0.3em] animate-in fade-in slide-in fade-in slide-in-from-left duration-700">
              Отопление, вода и очистка в Орле — под ключ
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              ИНЖЕНЕРНЫЕ СИСТЕМЫ <br />
              ДЛЯ ДОМА И БИЗНЕСА <br />
              <span className="text-[#d71e1e]">ПОД КЛЮЧ</span>
            </h1>

            <p className="text-lg text-blue-100 mb-6 max-w-md leading-relaxed">
              По договору, с фиксированной сметой и гарантией
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-sm md:text-base font-semibold uppercase tracking-wider text-blue-100/80">
              <span className="flex items-center"><Settings className="mr-2 text-[#d71e1e]" size={20} /> Проектирование</span>
              <span className="flex items-center"><Wrench className="mr-2 text-[#d71e1e]" size={20} /> Монтаж</span>
              <span className="flex items-center"><Shield className="mr-2 text-[#d71e1e]" size={20} /> Обслуживание</span>
            </div>
            
            <p className="text-lg text-blue-100 mb-10 max-w-lg leading-relaxed border-l-4 border-[#d71e1e] pl-6">
              Комплектуем и монтируем надежные котельные и системы водоочистки в Орле. 
              <span className="text-white font-bold block mt-2">Официальная гарантия, свой склад запчастей и сервис 24/7.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={onCtaPrimary}
                className="bg-[#d71e1e] hover:bg-[#b01818] text-white px-10 py-5 rounded font-black uppercase tracking-widest shadow-2xl transition-all transform hover:-translate-y-1 hover:shadow-red-900/50"
              >
                Рассчитать смету
              </button>
              <button
                onClick={onCtaSecondary}
                className="bg-white hover:bg-gray-100 text-[#1a224f] px-10 py-5 rounded font-black uppercase tracking-widest shadow-xl transition-all hover:bg-opacity-90"
              >
                Вызвать инженера
              </button>
            </div>

            <div className="flex items-center space-x-8 text-xs font-bold text-blue-200">
              <div className="flex items-center"><Shield className="mr-2 text-green-400" size={16} /> АВТОРИЗОВАННЫЙ СЕРВИС BAXI</div>
              <div className="flex items-center"><Wrench className="mr-2 text-green-400" size={16} /> ОПЫТ РАБОТЫ 12 ЛЕТ</div>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-1000">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
            <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-3xl overflow-hidden shadow-2xl transform rotate-y-12 transition-transform duration-500 hover:rotate-y-0">
                <img
                  src="/1.png"
                  alt="Инженерные системы"
                  className="rounded-2xl opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 w-full object-cover h-[500px]"
                />
                <div className="absolute bottom-8 right-8 bg-[#1a224f]/90 backdrop-blur-md p-6 rounded-2xl border-l-4 border-[#d71e1e] shadow-2xl max-w-xs">
                    <div className="text-3xl font-black text-white mb-1">5000+</div>
                    <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest leading-none mb-2">довольных клиентов</div>
                    <p className="text-xs text-blue-100 leading-tight">От замены крана до промышленных котельных.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
