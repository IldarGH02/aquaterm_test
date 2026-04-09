import { FC } from 'react'

import { Check } from 'lucide-react'

interface IQuizItemProps {
    idx: number,
    handleSelect: (option: string) => void,
    isSelected: boolean,
    option: string
}

export const QuizItem: FC<IQuizItemProps> = ({ idx, handleSelect, isSelected, option }) => {
    return (
        <button
            key={idx}
            onClick={() => handleSelect(option)}
            className={`relative text-left p-4 sm:p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 group flex justify-between items-start min-h-[80px] ${
                isSelected
                    ? 'border-[#1a224f] bg-[#1a224f] text-white shadow-xl scale-[1.02]'
                    : 'border-gray-100 hover:border-[#d71e1e] hover:shadow-lg hover:-translate-y-1 bg-white text-[#1a224f]'
            }`}
        >
            <span className="font-bold text-sm sm:text-base md:text-lg pr-6 sm:pr-8">{option}</span>
            <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors mt-1 ${
                isSelected
                    ? 'border-white bg-white text-[#1a224f]'
                    : 'border-gray-200 group-hover:border-[#d71e1e]'
            }`}>
                {isSelected && <Check size={12} strokeWidth={4} />}
            </div>
        </button>
    )
}