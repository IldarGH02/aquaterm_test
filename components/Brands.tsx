
import React from 'react';
import { BRANDS } from '../constants';

const BrandItem: React.FC<{ name: string }> = ({ name }) => (
  <span
    className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-200 uppercase tracking-tighter hover:text-[#1a224f] transition-colors duration-300 cursor-default select-none flex-shrink-0"
    style={{ fontFamily: 'Montserrat, sans-serif' }}
    aria-hidden="true"
  >
    {name}
  </span>
);

const Brands: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-gray-100 overflow-hidden py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4 mb-4 sm:mb-6">
        <p className="text-center text-sm font-black uppercase tracking-[0.3em] text-gray-400">
          Официальные партнеры и авторизованный сервис
        </p>
      </div>

      {/* Marquee: анимация отключена при prefers-reduced-motion (см. index.css) */}
      <div className="relative flex overflow-x-hidden" role="list" aria-label="Бренды партнёров">
        {/* Видимые бренды для screen reader — один проход без aria-hidden */}
        <ul className="sr-only">
          {BRANDS.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>

        {/* Визуальная бегущая строка (aria-hidden — дубли скрыты от ридеров) */}
        <div
          className="animate-marquee whitespace-nowrap flex items-center gap-8 sm:gap-12 md:gap-16 px-6 sm:px-8"
          aria-hidden="true"
        >
          {[...BRANDS, ...BRANDS].map((brand, idx) => (
            <BrandItem key={idx} name={brand} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
