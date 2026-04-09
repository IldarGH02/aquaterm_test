import { CASES } from '@shared/constants';
import { CasesList } from '@widgets/Cases/ui/CasesList.tsx';
import { Section } from '@shared/ui/Section'

export const Cases = () => {
  return (
    <Section
        id="cases"
        className="reveal scroll-mt-28 bg-gray-50 py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24"
    >
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 md:mb-16 gap-4 sm:gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#1a224f] mb-4 sm:mb-6 uppercase tracking-tight">
                        НАШИ <span className="text-[#d71e1e]">РАБОТЫ</span>
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                        Мы гордимся качеством исполнения наших систем. Посмотрите примеры
                        реальных объектов с ценами и сроками исполнения.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <div className="w-8 sm:w-12 h-1 sm:h-1.5 bg-[#d71e1e] rounded-full"></div>
                    <div className="w-4 sm:w-6 h-1 sm:h-1.5 bg-[#1a224f] rounded-full opacity-20"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <CasesList items={ CASES }/>
            </div>
        </div>
    </Section>
  );
};