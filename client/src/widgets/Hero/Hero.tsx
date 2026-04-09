import { FC } from 'react';
import { Shield, Settings, Wrench } from 'lucide-react';

interface HeroProps {
  onCtaPrimary: () => void;
  onCtaSecondary: () => void;
}

export const Hero: FC<HeroProps> = ({ onCtaPrimary, onCtaSecondary }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-28 overflow-x-hidden bg-[#1a224f]">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d71e1e] skew-x-[-12deg] translate-x-1/4 opacity-10 md:opacity-100 hidden md:block" />

      <div className="container mx-auto px-4 xl:px-8 z-10 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-10 xl:gap-14 items-center">

          {/* ── Левая часть: текст ── */}
          <div className="text-white">

            {/* Бейдж */}
            <div className="inline-block bg-[#d71e1e] px-3 py-1 mb-4 lg:mb-5 text-[10px] lg:text-xs font-bold uppercase tracking-[0.3em] animate-in fade-in slide-in-from-left duration-700">
              Отопление, вода и очистка в Орле — под ключ
            </div>

            {/* Заголовок */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-extrabold leading-tight mb-3 lg:mb-4 tracking-tight">
              ИНЖЕНЕРНЫЕ СИСТЕМЫ<br />
              ДЛЯ ДОМА И БИЗНЕСА<br />
              <span className="text-[#d71e1e]">ПОД КЛЮЧ</span>
            </h1>

            {/* Теги */}
            <div className="flex flex-wrap gap-2 mb-4 lg:mb-5 text-xs font-semibold uppercase tracking-wider text-blue-100/80">
              <span className="flex items-center gap-1.5"><Settings size={14} className="text-[#d71e1e]" /> Проектирование</span>
              <span className="flex items-center gap-1.5"><Wrench size={14} className="text-[#d71e1e]" /> Монтаж</span>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#d71e1e]" /> Сервис</span>
            </div>

            {/* Описание */}
            <p className="text-sm lg:text-sm xl:text-base text-blue-100 mb-6 lg:mb-7 max-w-md leading-relaxed border-l-4 border-[#d71e1e] pl-4">
              Комплектуем и монтируем надежные котельные и системы водоочистки в Орле и Орловской области.{' '}
              <span className="text-white font-bold">Официальная гарантия, свой склад запчастей и сервис.</span>
            </p>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 lg:mb-8">
              <button
                onClick={onCtaPrimary}
                className="bg-[#d71e1e] hover:bg-[#b01818] text-white px-7 py-3.5 rounded font-black text-sm uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto flex items-center justify-center"
              >
                Рассчитать смету
              </button>
              <button
                onClick={onCtaSecondary}
                className="bg-white hover:bg-gray-100 text-[#1a224f] px-7 py-3.5 rounded font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center"
              >
                Вызвать инженера
              </button>
            </div>

            {/* Бейджи доверия */}
            {/*<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs font-bold text-blue-200 pb-6 lg:pb-8">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <Shield size={14} className="text-green-400" />*/}
            {/*    АВТОРИЗОВАННЫЙ СЕРВИС BAXI*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <Wrench size={14} className="text-green-400" />*/}
            {/*    ОПЫТ РАБОТЫ 15 ЛЕТ*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          {/* ── Правая часть: фото ── */}
          <div className="relative hidden lg:flex justify-center perspective-1000">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse" />
            <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-3xl overflow-hidden shadow-2xl transform rotate-y-12 transition-transform duration-500 hover:rotate-y-0 w-full">
              <img
                src="/1.png"
                alt="Инженерные системы отопления и водоснабжения"
                loading="lazy"
                className="rounded-2xl opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 w-full object-cover aspect-[4/3]"
                width={1200}
                height={900}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <div className="absolute top-4 left-4 lg:top-5 lg:left-5 bg-[#1a224f]/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl border-l-4 border-[#d71e1e] shadow-2xl max-w-[200px]">
                <div className="text-1xl lg:text-1xl font-black text-white mb-0.5">
                  АВТОРИЗОВАННЫЙ СЕРВИС BAXI
                </div>
              </div>

              <div className="absolute top-4 right-4 lg:top-5 lg:right-5 bg-[#1a224f]/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl border-l-4 border-[#d71e1e] shadow-2xl max-w-[200px]">
                <div className="text-1xl lg:text-1xl font-black text-white mb-0.5">
                  ОПЫТ РАБОТЫ 15 ЛЕТ
                </div>
              </div>

              <div className="absolute bottom-4 right-4 lg:bottom-5 lg:right-5 bg-[#1a224f]/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl border-l-4 border-[#d71e1e] shadow-2xl max-w-[200px]">
                <div className="text-2xl lg:text-3xl font-black text-white mb-0.5">5000+</div>
                <div className="text-[10px] lg:text-xs text-blue-200 font-bold uppercase tracking-widest leading-none mb-1">довольных клиентов</div>
                <p className="text-xs text-blue-100 leading-tight">От замены крана до промышленных котельных.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
