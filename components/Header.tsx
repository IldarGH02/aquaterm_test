
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { CONTACTS } from '../constants';

interface HeaderProps {
  onCtaClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ ИСПРАВЛЕНО: Добавлен debounce для оптимизации
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
      }, 100);
    };
    
    // ✅ Использовать passive для лучшей производительности
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Услуги', href: '#services' },
    { name: 'Расчет', href: '#quiz' },
    { name: 'Работы', href: '#portfolio' },
    { name: 'Отзывы', href: '#reviews' },
    { name: 'Контакты', href: '#contacts' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl py-2' : 'bg-transparent py-4'}`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center'>
          {/* Logo Section */}
          <a href='/' className='flex flex-col group'>
            <div className='flex items-baseline'>
              <span
                className={`logo-font text-2xl md:text-3xl tracking-tighter transition-colors ${isScrolled ? 'text-[#1a224f]' : 'text-white'}`}
              >
                АКВА
              </span>
              <span
                className={`logo-font text-2xl md:text-3xl tracking-tighter text-[#d71e1e] ml-1`}
              >
                ТЕРМ
              </span>
            </div>
            <div
              className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] border-t-2 mt-[-2px] transition-colors ${isScrolled ? 'text-[#1a224f] border-[#1a224f]' : 'text-white border-white'}`}
            >
              инженерно - сервисный центр
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className='hidden lg:flex items-center space-x-6'>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-semibold text-sm uppercase tracking-wider hover:text-[#d71e1e] transition-colors ${isScrolled ? 'text-[#1a224f]' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <div
              className={`flex flex-col items-end border-l pl-6 transition-colors ${isScrolled ? 'border-gray-200 text-[#1a224f]' : 'border-white/20 text-white'}`}
            >
              <div className='space-y-1'>
                <a
                  href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`}
                  className='font-bold text-lg hover:text-[#d71e1e] transition-colors block'
                >
                  Инженерный центр {CONTACTS.phone1}
                </a>
                <a
                  href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`}
                  className='font-bold text-lg hover:text-[#d71e1e] transition-colors block'
                >
                  Сервисный центр {CONTACTS.phone2}
                </a>
              </div>
            </div>
            <button
              onClick={onCtaClick}
              className='bg-[#1a224f] hover:bg-[#2a3575] text-white px-6 py-2.5 rounded shadow-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-95'
            >
              Вызвать инженера
            </button>
            <span className='text-[15px] opacity-70'>Работаем с 09:00 до 19:00</span>
          </nav>

          {/* Mobile toggle */}
          <button
            className='lg:hidden p-3 sm:p-4 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-nav'
          >
            {isMenuOpen ? (
              <X size={28} className='text-[#1a224f]' />
            ) : (
              <Menu size={28} className={isScrolled ? 'text-[#1a224f]' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id='mobile-nav'
          className='lg:hidden bg-white absolute top-full left-0 w-full shadow-2xl animate-in slide-in-from-top duration-300 z-40'
          role='navigation'
          aria-label='Мобильная навигация'
        >
          <nav className='flex flex-col p-4 sm:p-6 space-y-3 sm:space-y-4'>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className='text-lg sm:text-xl font-bold text-[#1a224f] hover:text-[#d71e1e] transition-colors py-2'
              >
                {link.name}
              </a>
            ))}
            <div className='pt-4 sm:pt-6 border-t space-y-3 sm:space-y-4'>
              <a
                href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`}
                className='block text-lg sm:text-xl font-bold text-[#1a224f] hover:text-[#d71e1e] transition-colors'
              >
                Инженерный центр {CONTACTS.phone1}
              </a>
              <a
                href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`}
                className='block text-lg sm:text-xl font-bold text-[#1a224f] hover:text-[#d71e1e] transition-colors'
              >
                Сервисный центр {CONTACTS.phone2}
              </a>
              <p className='text-sm sm:text-base text-gray-500'>{CONTACTS.address}</p>
            </div>
            <button
              onClick={() => {
                onCtaClick()
                setIsMenuOpen(false)
              }}
              className='bg-[#1a224f] text-white py-3 sm:py-4 rounded font-bold uppercase tracking-wider w-full min-h-[44px]'
            >
              Записаться на сервис
            </button>
          </nav>
        </div>
      )}
    </header>
  )
};

export default Header;
