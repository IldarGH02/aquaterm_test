import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Wrench, Clock } from 'lucide-react';
import { CONTACTS } from '../constants';

interface HeaderProps {
  onCtaClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolled(window.scrollY > 20), 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { clearTimeout(timeoutId); window.removeEventListener('scroll', handleScroll); };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Услуги', href: '#services' },
    { name: 'Расчет', href: '#quiz' },
    { name: 'Работы', href: '#portfolio' },
    { name: 'Отзывы', href: '#reviews' },
    { name: 'Контакты', href: '#contacts' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-50">

      {/* ── Топ-бар: телефоны + режим работы ── */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="bg-[#1a224f]/80 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-10 text-white">

              {/* Телефоны */}
              <div className="flex items-center gap-6">
                <a
                  href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`}
                  className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#d71e1e] transition-colors group"
                >
                  <Phone size={13} className="text-[#d71e1e]" />
                  <span className="hidden sm:inline text-white/50 text-xs uppercase tracking-wider mr-0.5">Инженерный:</span>
                  <span>{CONTACTS.phone1}</span>
                </a>
                <a
                  href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`}
                  className="hidden md:flex items-center gap-1.5 text-sm font-semibold hover:text-[#d71e1e] transition-colors"
                >
                  <Wrench size={13} className="text-[#d71e1e]" />
                  <span className="hidden sm:inline text-white/50 text-xs uppercase tracking-wider mr-0.5">Сервис:</span>
                  <span>{CONTACTS.phone2}</span>
                </a>
              </div>

              {/* Режим работы */}
              <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                <Clock size={12} className="text-[#d71e1e]" />
                <span>Пн–Пт 09:00–19:00, Сб 09:00–15:00</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Основной хедер: лого + nav + кнопка ── */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-xl py-3'
            : 'bg-[#1a224f]/60 backdrop-blur-sm py-3'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">

            {/* Лого */}
            <a href="/" className="flex flex-col shrink-0 group">
              <div className="flex items-baseline">
                <span className={`logo-font text-2xl md:text-3xl tracking-tighter transition-colors ${isScrolled ? 'text-[#1a224f]' : 'text-white'}`}>
                  АКВА
                </span>
                <span className="logo-font text-2xl md:text-3xl tracking-tighter text-[#d71e1e] ml-1">
                  ТЕРМ
                </span>
              </div>
              <div className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-t-2 mt-[-2px] transition-colors ${isScrolled ? 'text-[#1a224f] border-[#1a224f]' : 'text-white border-white'}`}>
                инженерно-сервисный центр
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm uppercase tracking-wider transition-colors hover:text-[#d71e1e] hover:bg-white/10 ${
                    isScrolled ? 'text-[#1a224f]' : 'text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* CTA кнопка */}
            <button
              onClick={onCtaClick}
              className="hidden lg:flex items-center gap-2 bg-[#d71e1e] hover:bg-[#b81818] text-white px-5 py-2.5 rounded-lg shadow-lg font-bold text-sm uppercase tracking-wider transition-all active:scale-95 shrink-0"
            >
              <Phone size={15} />
              Вызвать инженера
            </button>

            {/* Mobile: телефон + бургер */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`}
                className={`p-2.5 rounded-lg transition-colors ${isScrolled ? 'text-[#1a224f] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                aria-label="Позвонить"
              >
                <Phone size={22} />
              </a>
              <button
                className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${isScrolled ? 'text-[#1a224f] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Мобильный оверлей ── */}
      {isMenuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          onClick={closeMenu}
          aria-label="Закрыть меню"
        />
      )}

      {/* ── Мобильное меню ── */}
      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden bg-white fixed top-[104px] left-0 right-0 max-h-[calc(100vh-104px)] overflow-y-auto shadow-2xl z-50 animate-in slide-in-from-top duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
        >
          <nav className="flex flex-col p-5 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-bold text-[#1a224f] hover:text-[#d71e1e] hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
            <a
              href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 bg-[#1a224f]/10 rounded-lg shrink-0">
                <Phone size={18} className="text-[#1a224f]" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Инженерный центр</p>
                <p className="text-base font-bold text-[#1a224f]">{CONTACTS.phone1}</p>
              </div>
            </a>
            <a
              href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 bg-[#d71e1e]/10 rounded-lg shrink-0">
                <Wrench size={18} className="text-[#d71e1e]" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Сервисный центр</p>
                <p className="text-base font-bold text-[#1a224f]">{CONTACTS.phone2}</p>
              </div>
            </a>
            <div className="flex items-center gap-2 text-gray-400 text-sm px-1">
              <Clock size={14} className="text-[#d71e1e]" />
              <span>Пн–Пт 09:00–19:00, Сб 09:00–15:00</span>
            </div>
            <button
              onClick={() => { onCtaClick(); closeMenu(); }}
              className="w-full bg-[#d71e1e] hover:bg-[#b81818] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} />
              Вызвать инженера
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
