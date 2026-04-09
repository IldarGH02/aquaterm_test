import { useCallback, useRef, useState, useEffect } from "react";
import { QUIZ_STEPS } from "@shared/constants";

export const UseStepSelect = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isFinished, setIsFinished] = useState(false);

    const stepTimeoutRef = useRef<number | null>(null);

    const handleSelect = useCallback((option: string): void => {
        // Сохраняем ответ
        setAnswers(prev => ({
            ...prev,
            [currentStep]: option
        }));

        // Очищаем предыдущий таймаут
        if (stepTimeoutRef.current) {
            window.clearTimeout(stepTimeoutRef.current);
        }

        // Устанавливаем новый таймаут для перехода
        if (currentStep < QUIZ_STEPS.length - 1) {
            stepTimeoutRef.current = window.setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 400);
        } else {
            stepTimeoutRef.current = window.setTimeout(() => {
                setIsFinished(true);
            }, 400);
        }
    }, [currentStep]);

    // Очищаем таймаут при размонтировании
    useEffect(() => {
        return () => {
            if (stepTimeoutRef.current) {
                window.clearTimeout(stepTimeoutRef.current);
            }
        };
    }, []);

    return {
        currentStep,
        answers,
        isFinished,
        handleSelect,
        setIsFinished,
        setCurrentStep,
        setAnswers
    };
}

