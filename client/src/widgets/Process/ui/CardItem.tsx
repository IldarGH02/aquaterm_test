import React, { ComponentType, FC, ReactNode } from 'react';
import { ProcessStep } from '@shared/constants';

interface CardProps {
  step: ProcessStep;
  IconComponent: ComponentType<{ className?: string }>;
}

export const CardItem: FC<CardProps> = ({ step, IconComponent }) => {
  return (
    <div key={step.id} className="relative group">
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-5 md:p-6 h-full hover:border-[#d71e1e] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
          <div className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 bg-[#1a224f] text-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-[#d71e1e] transition-colors text-xs sm:text-sm md:text-base flex-shrink-0">
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-100 absolute top-1 sm:top-2 right-3 sm:right-4 -z-0 group-hover:text-gray-50 transition-colors">
            0{step.id}
          </span>
        </div>

        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1a224f] mb-2 sm:mb-3 relative z-10">
          {step.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed relative z-10">
          {step.description}
        </p>
      </div>
    </div>
  )
}