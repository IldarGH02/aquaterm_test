
import React, { useState } from 'react';
import { FAQS } from '../constants';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4">
       <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Header Section */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs uppercase tracking-[0.3em] mb-4">
                <HelpCircle size={18} />
                <span>Вопросы и ответы</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a224f] mb-8 uppercase tracking-tight">
               ОСТАЛИСЬ <br /> <span className="text-[#d71e1e]">ВОПРОСЫ?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
               Мы собрали самые популярные вопросы наших клиентов. 
               Если вы не нашли ответ, свяжитесь с нами напрямую.
            </p>
            <a href="#contacts" className="inline-flex items-center font-bold text-[#1a224f] hover:text-[#d71e1e] transition-colors uppercase tracking-widest text-sm border-b-2 border-[#1a224f] hover:border-[#d71e1e] pb-1">
               Задать вопрос инженеру
            </a>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-7 space-y-4">
             {FAQS.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border-2 rounded-2xl transition-all duration-300 overflow-hidden ${
                    openIndex === index ? 'border-[#1a224f] bg-white shadow-lg' : 'border-gray-100 bg-white hover:border-blue-100'
                  }`}
                >
                   <button 
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                   >
                      <span className={`text-lg md:text-xl font-bold transition-colors ${
                         openIndex === index ? 'text-[#1a224f]' : 'text-gray-800'
                      }`}>
                         {faq.question}
                      </span>
                      <ChevronDown 
                         className={`flex-shrink-0 ml-4 transition-transform duration-300 text-[#d71e1e] ${
                            openIndex === index ? 'rotate-180' : 'rotate-0'
                         }`} 
                         size={24} 
                      />
                   </button>
                   
                   <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                         openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                   >
                      <div className="p-6 md:p-8 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/50">
                         {faq.answer}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default FAQ;
