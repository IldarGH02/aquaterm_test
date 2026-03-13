
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { CONTACTS } from '../constants';

interface HeaderProps {
  onCtaClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <a href="/" className="flex flex-col group">
            <div className="flex items-baseline">
              <span className={`logo-font text-2xl md:text-3xl tracking-tighter transition-colors ${isScrolled ? 'text-[#1a224f]' : 'text-white'}`}>
                АКВА
              </span>
              <span className={`logo-font text-2xl md:text-3xl tracking-tighter text-[#d71e1e] ml-1`}>
                ТЕРМ
              </span>
            </div>
            <div className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] border-t-2 mt-[-2px] transition-colors ${isScrolled ? 'text-[#1a224f] border-[#1a224f]' : 'text-white border-white'}`}>
              инженерно - сервисный центр
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
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
            <div className={`flex flex-col items-end border-l pl-6 transition-colors ${isScrolled ? 'border-gray-200 text-[#1a224f]' : 'border-white/20 text-white'}`}>
              <a href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`} className="font-bold text-lg hover:text-[#d71e1e] transition-colors">
                {CONTACTS.phone1}
              </a>
              <span className="text-[10px] opacity-70">Работаем с 15:00 до 19:00</span>
            </div>
            <button 
              onClick={onCtaClick}
              className="bg-[#1a224f] hover:bg-[#2a3575] text-white px-6 py-2.5 rounded shadow-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Вызвать инженера
            </button>
          </nav>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} className="text-[#1a224f]" /> : <Menu size={32} className={isScrolled ? 'text-[#1a224f]' : 'text-white'} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white absolute top-full left-0 w-full shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-bold text-[#1a224f] hover:text-[#d71e1e]"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t space-y-2">
              <a href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`} className="block text-xl font-bold text-[#1a224f]">
                {CONTACTS.phone1}
              </a>
              <p className="text-sm text-gray-500">{CONTACTS.address}</p>
            </div>
            <button 
              onClick={() => { onCtaClick(); setIsMenuOpen(false); }}
              className="bg-[#1a224f] text-white py-4 rounded font-bold uppercase tracking-wider"
            >
              Записаться на сервис
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
