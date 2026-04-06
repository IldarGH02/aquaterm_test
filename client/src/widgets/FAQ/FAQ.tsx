import { FAQS } from '@shared/constants';
import { HelpCircle } from 'lucide-react';
import { FaqList } from '@widgets/FAQ/ui/FaqList.tsx';
import { useIndex } from '@shared/lib/hooks/FAQ/useIndex.tsx';
import { Section } from '@shared/ui/Section'

export const FAQ = () => {
  const { openIndex, toggleFAQ } = useIndex()

  return (
    <Section
        id="faq"
        className="reveal scroll-mt-28 bg-white py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24"
    >
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-start">
                {/* Header Section */}
                <div className="lg:col-span-5 lg:sticky lg:top-24">
                    {/*<div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 sm:mb-4">*/}
                    {/*    <HelpCircle size={14} />*/}
                    {/*    <span>Вопросы и ответы</span>*/}
                    {/*</div>*/}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1a224f] mb-4 sm:mb-6 md:mb-8 uppercase tracking-tight">
                        ОСТАЛИСЬ <br /> <span className="text-[#d71e1e]">ВОПРОСЫ?</span>
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
                        Мы собрали самые популярные вопросы наших клиентов.
                        Если вы не нашли ответ, свяжитесь с нами напрямую.
                    </p>
                    <a href="#contacts" className="inline-flex items-center font-bold text-[#1a224f] hover:text-[#d71e1e] transition-colors uppercase tracking-widest text-xs sm:text-sm border-b-2 border-[#1a224f] hover:border-[#d71e1e] pb-1">
                        Задать вопрос инженеру
                    </a>
                </div>

                {/* Questions List */}
                <div className="lg:col-span-7 space-y-3 sm:space-y-4 md:space-y-5">
                    <FaqList items={FAQS} openIndex={openIndex} toggleFAQ={toggleFAQ}/>
                </div>
            </div>
        </div>
    </Section>
  );
};
