import React, { useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Services from './components/Services';
import Advantages from './components/Advantages';
import Process from './components/Process';
import Cases from './components/Cases';
import Quiz from './components/Quiz';
import FAQ from './components/FAQ';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';

const App: React.FC = () => {
  const { openModal, openSuccessModal } = useModal();

  // ✅ ИСПРАВЛЕНО: Правильный Intersection Observer с MutationObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.classList.contains('reveal')) {
              observer.observe(element);
            }
            element.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
          }
        });
      });
    });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onCtaClick={() => openModal('engineer')} />
      
      <main>
        <Hero onCtaPrimary={() => openModal('cost')} onCtaSecondary={() => openModal('engineer')} />
        
        <Brands />

        <section id="services" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white reveal">
          <Services onCtaClick={() => openModal('consultation')} />
        </section>

        <section id="advantages" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 reveal">
          <Advantages />
        </section>

        <section id="process" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white reveal">
           <Process />
        </section>

        <section id="quiz" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-[#1a224f] overflow-hidden reveal">
          <Quiz onSubmitSuccess={() => openSuccessModal({ 
            title: 'Заявка на расчет отправлена!', 
            message: 'Мы рассчитаем стоимость и свяжемся с вами в течение 1 минуты.' 
          })} />
        </section>

        <section id="portfolio" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 reveal">
          <Cases />
        </section>
        
        <section id="faq" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white reveal">
           <FAQ />
        </section>

        <section id="reviews" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 reveal">
          <Reviews />
        </section>

        <section id="contacts" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white reveal">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div>
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-[#d71e1e]"></div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a224f] uppercase tracking-wider">СВЯЖИТЕСЬ С НАМИ</h2>
              </div>
              <p className="text-gray-600 mb-6 sm:mb-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed">
                Оставьте заявку, и наш инженер свяжется с вами в течение 15 минут для консультации. 
                Мы не спамим, звоним только по делу.
              </p>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 group cursor-pointer" onClick={() => window.open('tel:89208182905')}>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-2xl shadow-sm text-[#d71e1e] group-hover:bg-[#d71e1e] group-hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <svg className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">Служба сервиса</div>
                    <div className="text-base sm:text-lg md:text-xl font-black text-[#1a224f]">8(920)818-29-05</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-2xl shadow-sm text-[#d71e1e] min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <svg className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">Офис и склад</div>
                    <div className="text-base sm:text-lg md:text-xl font-black text-[#1a224f]">г. Орел, ул. 2 Курская, дом 3</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl shadow-lg border border-gray-100">
              <ContactForm type="main" onSubmitSuccess={openSuccessModal} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
