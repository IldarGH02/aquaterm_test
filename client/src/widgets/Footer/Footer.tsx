import { CONTACTS } from "@shared/constants";
import { ChevronUp, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import React from "react";

export const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const websiteUrl = CONTACTS.website.startsWith('http') ? CONTACTS.website : `https://${CONTACTS.website}`;

    return (
        <footer className="bg-[#1a224f] text-white pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10 relative overflow-hidden">
            {/* Visual accent from the brand style */}
            <div className="absolute bottom-0 left-0 w-full h-1 sm:h-2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-10 sm:mb-14 md:mb-20">
                    <div>
                        <div className="flex flex-col mb-6 sm:mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="logo-font text-2xl sm:text-3xl tracking-tighter text-white">АКВА</span>
                                <span className="logo-font text-2xl sm:text-3xl tracking-tighter text-[#d71e1e]">ТЕРМ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-t-2 border-white mt-[-2px] text-white">
                                инженерно - сервисный центр
                            </div>
                        </div>
                        <p className="text-blue-100/60 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                            Ваш надежный партнер в создании комфорта. Продажа, монтаж и сервисное
                            обслуживание инженерных систем в Орле и области.
                        </p>
                        <div className="flex space-x-2 sm:space-x-3">
                            <a
                                href={`mailto:${CONTACTS.email}`}
                                className="w-9 sm:w-10 h-9 sm:h-10 border border-white/10 rounded flex items-center justify-center hover:bg-[#d71e1e] hover:border-[#d71e1e] transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                                aria-label="Написать на email"
                            >
                                <MessageCircle size={16} />
                            </a>
                            <a
                                href={websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 sm:w-10 h-9 sm:h-10 border border-white/10 rounded flex items-center justify-center hover:bg-[#d71e1e] hover:border-[#d71e1e] transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                                aria-label="Открыть сайт компании"
                            >
                                <Globe size={16} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-4 sm:mb-6 md:mb-8 text-[#d71e1e]">Услуги центра</h4>
                        <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-xs sm:text-sm font-semibold text-blue-100/70">
                            <li><a href="#services" className="hover:text-white transition-colors">Монтаж отопления</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Системы водоочистки</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Водоснабжение</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Ремонт котлов</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Продажа запчастей</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-4 sm:mb-6 md:mb-8 text-[#d71e1e]">Контакты</h4>
                        <ul className="space-y-4 sm:space-y-5 md:space-y-6">
                            <li className="flex items-start gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                                <MapPin className="text-[#d71e1e] flex-shrink-0 w-4 sm:w-5 mt-0.5" size={18} />
                                <span className="font-semibold leading-tight">{CONTACTS.address}</span>
                            </li>
                            <li className="flex flex-col space-y-1 sm:space-y-2">
                                <a href={`tel:${CONTACTS.phone1.replace(/\D/g, '')}`} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-black hover:text-[#d71e1e] transition-colors">
                                    <Phone className="text-[#d71e1e] flex-shrink-0 w-4 sm:w-5" size={18} />
                                    {CONTACTS.phone1}
                                </a>
                                <a href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-black hover:text-[#d71e1e] transition-colors pl-6 sm:pl-8">
                                    {CONTACTS.phone2}
                                </a>
                            </li>
                            <li className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                                <Mail className="text-[#d71e1e] flex-shrink-0 w-4 sm:w-5" size={18} />
                                <span className="font-semibold break-all">{CONTACTS.email}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-4 sm:mb-6 md:mb-8 text-[#d71e1e]">На связи</h4>
                            <p className="text-xs text-blue-100/50 mb-4 sm:mb-6 font-medium">Работаем ежедневно. Прием заявок на сайте — круглосуточно.</p>
                            <div className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                <div className="text-xs font-black uppercase tracking-widest text-blue-100/40 mb-1">Сайт</div>
                                <div className="text-sm sm:text-base md:text-lg font-black break-all">{CONTACTS.website}</div>
                            </div>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="mt-6 sm:mt-8 flex items-center justify-center gap-1 text-xs font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors group min-h-[44px]"
                        >
                            Вверх <ChevronUp size={12} className="group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="pt-6 sm:pt-8 md:pt-10 border-t border-white/10 flex flex-col gap-3 sm:gap-0 md:flex-row md:justify-between md:items-center text-xs font-bold uppercase tracking-widest text-blue-100/30">
                    <p>© {new Date().getFullYear()} Инженерно-сервисный центр Акватерм. Орел.</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-8">
                        <a href="/privacy-policy.html" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                        <a href="/sitemap.xml" className="hover:text-white transition-colors">Карта сайта</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}