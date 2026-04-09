import { Advantages } from '@shared/types/advantages.types.ts';
import { ComponentType, FC } from 'react';

interface IAdvantagesItemProps {
  advantage: Advantages;
  IconComponent: ComponentType<{ className?: string }>;
  idx: number;
}

export const AdvantagesItem: FC<IAdvantagesItemProps> = ({  advantage, IconComponent, idx }) => {
  return (
    <div key={idx} className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2 relative overflow-hidden">
      {/* Hover Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#d71e1e] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-[#1a224f]/5 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 text-[#1a224f] group-hover:bg-[#d71e1e] group-hover:text-white transition-colors duration-300">
        {IconComponent && <IconComponent className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8" />}
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-black text-[#1a224f] mb-2 sm:mb-3 group-hover:text-[#d71e1e] transition-colors">
        { advantage.title }
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
        { advantage.description }
      </p>
    </div>
  )
}