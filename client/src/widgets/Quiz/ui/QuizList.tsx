import { FC } from 'react'

import { QuizStep } from '@shared/types/quiz.types.ts'
import { QuizItem } from '@widgets/Quiz/ui/QuizItem.tsx'


interface IQuizList {
    items: QuizStep[]
    currentStep: number,
    answers: Record<number, string>,
    handleSelect: (value: string) => void
}

export const QuizList: FC<IQuizList> = ({items, currentStep, answers, handleSelect}) => {
    return items && items[currentStep].options.map((option, idx) => {
        const isSelected = answers[currentStep] === option
        return (
            <QuizItem idx={idx} option={option} handleSelect={() => handleSelect(option)} isSelected={isSelected}/>
        )
    })
}