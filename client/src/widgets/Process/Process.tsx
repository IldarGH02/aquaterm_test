import React from 'react';
import { PROCESS_STEPS } from '@shared/constants';
import { ProcessList } from '@widgets/Process/ui/ProcessList.tsx';
import { Section } from '@shared/ui/Section'

export const Process = () => {

  return (
    <Section id="process" className="reveal scroll-mt-28 bg-white py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 md:mb-16 gap-4 sm:gap-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center space-x-2 text-[#d71e1e] font-black text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 sm:mb-4">
                        <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 border-[#d71e1e] flex items-center justify-center">
                            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#d71e1e] rounded-full"></div>
                        </div>
                        <span>Прозрачная работа</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#1a224f] mb-4 sm:mb-6 uppercase tracking-tight leading-tight">
                        КАК МЫ <span className="text-[#d71e1e]">РАБОТАЕМ</span>
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                        Понятный процесс от звонка до тепла в вашем доме. Никаких скрытых платежей
                        и затягивания сроков.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 relative">
                <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                <ProcessList items={ PROCESS_STEPS }/>
            </div>
        </div>
    </Section>
  );
};