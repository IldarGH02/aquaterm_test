import { ChevronDown } from 'lucide-react';
import React, { FC } from 'react';
import { FAQS } from '@app/types/faq.types.ts';

interface IFaqItemProps {
  faq: FAQS;
  index: number;
  openIndex: number | null;
  toggleFAQ: (value: number) => void;
}

export const FaqItem: FC<IFaqItemProps> = ({faq, index, openIndex, toggleFAQ}) => {
  return (
    <div
      key={index}
      className={`border-2 rounded-2xl transition-all duration-300 overflow-hidden ${
        openIndex === index ? 'border-[#1a224f] bg-white shadow-lg' : 'border-gray-100 bg-white hover:border-blue-100'
      }`}
    >
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 text-left outline-none gap-3 min-h-[44px]"
      >
                      <span className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-colors leading-tight ${
                        openIndex === index ? 'text-[#1a224f]' : 'text-gray-800'
                      }`}>
                         {faq.question}
                      </span>
        <ChevronDown
          className={`flex-shrink-0 transition-transform duration-300 text-[#d71e1e] w-5 sm:w-6 ${
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
        <div className="p-4 sm:p-6 md:p-8 pt-0 text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed border-t border-gray-100/50">
          {faq.answer}
        </div>
      </div>
    </div>
  )
}