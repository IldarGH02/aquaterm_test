
import React from 'react';
import { MapPin, Phone, Mail, Instagram, MessageCircle, Globe, ChevronUp } from 'lucide-react';
import { CONTACTS } from '../constants';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#1a224f] text-white pt-20 pb-10 relative overflow-hidden">
      {/* Visual accent from the brand style */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#d71e1e]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex flex-col mb-8">
              <div className="flex items-baseline">
                <span className="logo-font text-3xl tracking-tighter text-white">АКВА</span>
                <span className="logo-font text-3xl tracking-tighter text-[#d71e1e] ml-1">ТЕРМ</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] border-t-2 border-white mt-[-2px] text-white">
                инженерно - сервисный центр
              </div>
            </div>
            <p className="text-blue-100/60 text-sm leading-relaxed mb-8">
              Ваш надежный партнер в создании комфорта. Продажа, монтаж и сервисное 
              обслуживание инженерных систем в Орле и области.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 border border-white/10 rounded flex items-center justify-center hover:bg-[#d71e1e] hover:border-[#d71e1e] transition-all">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded flex items-center justify-center hover:bg-[#d71e1e] hover:border-[#d71e1e] transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-[#d71e1e]">Услуги центра</h4>
            <ul className="space-y-4 text-sm font-semibold text-blue-100/70">
              <li><a href="#services" className="hover:text-white transition-colors">Монтаж отопления</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Системы водоочистки</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Водоснабжение</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Ремонт котлов</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Продажа запчастей</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-[#d71e1e]">Контакты</h4>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="mr-4 text-[#d71e1e] flex-shrink-0" size={20} />
                <span className="text-sm font-semibold leading-relaxed">{CONTACTS.address}</span>
              </li>
              <li className="flex flex-col space-y-2">
                <a href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`} className="flex items-center text-lg font-black hover:text-[#d71e1e] transition-colors">
                  <Phone className="mr-4 text-[#d71e1e] flex-shrink-0" size={20} />
                  {CONTACTS.phone1}
                </a>
                <a href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`} className="flex items-center text-lg font-black hover:text-[#d71e1e] transition-colors pl-9">
                  {CONTACTS.phone2}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-4 text-[#d71e1e] flex-shrink-0" size={20} />
                <span className="text-sm font-semibold">{CONTACTS.email}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-[#d71e1e]">На связи</h4>
              <p className="text-xs text-blue-100/50 mb-6 font-medium">Работаем ежедневно. Прием заявок на сайте — круглосуточно.</p>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-100/40 mb-1">Сайт</div>
                <div className="text-lg font-black">{CONTACTS.website}</div>
              </div>
            </div>
            <button 
              onClick={scrollToTop}
              className="mt-8 flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors group"
            >
              Вверх <ChevronUp size={14} className="ml-2 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-blue-100/30">
          <p>© {new Date().getFullYear()} Инженерно-сервисный центр Акватерм. Орел.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Карта сайта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
