import { useCallback, useEffect, useRef, FC } from 'react';
import { QUIZ_STEPS } from "@shared/constants";
import { ChevronLeft, Check, Gift, Timer, Calculator } from 'lucide-react';
import { UseStepSelect } from "@shared/lib/hooks/StepSelect/useStepSelect.tsx";
import { QuizForm } from '@features/QuizForm/QuizForm.tsx'
import { QuizList } from '@widgets/Quiz/ui/QuizList.tsx'
import { Section } from '@shared/ui/Section'

export const Quiz: FC<{ onSubmitSuccess?:() => void}> = ( { onSubmitSuccess }) => {
    const stepTimeoutRef = useRef<number | null>(null);
    const submitTimeoutRef = useRef<number | null>(null);
    const isMountedRef = useRef(true);
    const {
        answers,
        currentStep,
        setCurrentStep,
        isFinished,
        handleSelect
    } = UseStepSelect()

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (stepTimeoutRef.current) {
                window.clearTimeout(stepTimeoutRef.current);
            }
            if (submitTimeoutRef.current) {
                window.clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    const progress = ((currentStep + (isFinished ? 1 : 0)) / (QUIZ_STEPS.length)) * 100;

    return (
        <Section
            id="quiz"
            className="reveal scroll-mt-28 overflow-hidden bg-[#1a224f] py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24"
        >
            <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-auto lg:min-h-[600px]">

                {/* Left Sidebar - Info Panel - СКРЫТ НА МОБИЛЯХ */}
                <div className="hidden lg:flex lg:w-[35%] bg-[#1a224f] text-white p-8 sm:p-10 md:p-14 flex-col justify-between relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d71e1e] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        {/*<div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-white/10">*/}
                        {/*    <Calculator size={14} className="text-[#d71e1e]" />*/}
                        {/*    <span>Онлайн-расчет</span>*/}
                        {/*</div>*/}

                        <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                            РАССЧИТАЙТЕ СТОИМОСТЬ <br />
                            <span className="text-[#d71e1e]">ЗА 1 МИНУТУ</span>
                        </h2>

                        <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
                            Ответьте на {QUIZ_STEPS.length} простых вопроса, чтобы получить предварительную смету и зафиксировать подарок.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6 mt-auto">
                        <div className="flex items-center space-x-4 bg-[#13193a] p-4 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 bg-[#d71e1e] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/50">
                                <Gift className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-white mb-1">Скидка 5% на монтаж</div>
                                <div className="text-xs text-blue-200">Закрепляется за номером</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 text-sm text-blue-300/60 font-medium">
                            <Timer size={16} />
                            <span>Инженер перезвонит в течение 15 минут</span>
                        </div>
                    </div>
                </div>

                {/* Right Content - Quiz Interaction - ПОЛНАЯ ШИРИНА НА МОБИЛЯХ */}
                <div className="w-full lg:w-[65%] bg-white p-4 sm:p-6 md:p-8 lg:p-14 relative flex flex-col">
                    {/* Progress bar line */}
                    <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gray-100">
                        <div
                            className="h-full bg-[#d71e1e] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(215,30,30,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {!isFinished ? (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-500 pt-2 sm:pt-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-12 gap-2">
                                <div className="text-xs sm:text-sm font-black text-gray-300 uppercase tracking-widest">
                                    Шаг <span className="text-base sm:text-lg text-[#1a224f]">{currentStep + 1}</span> / {QUIZ_STEPS.length}
                                </div>
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="group flex items-center text-xs sm:text-sm font-bold text-gray-400 hover:text-[#1a224f] transition-colors"
                                    >
                                        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                        Назад
                                    </button>
                                )}
                            </div>

                            <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#1a224f] mb-4 sm:mb-6 md:mb-10 leading-snug">
                                {QUIZ_STEPS[currentStep].question}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-5 mb-4 sm:mb-6 md:mb-8">
                                <QuizList items={ QUIZ_STEPS } currentStep={ currentStep } answers={ answers } handleSelect={ handleSelect }/>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full justify-center animate-in zoom-in duration-500 max-w-2xl mx-auto w-full">
                            <div className="text-center mb-6 sm:mb-10">
                                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm border border-green-100">
                                    <Check size={32} strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a224f] mb-3 sm:mb-4">Расчет готов!</h3>
                                <p className="text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed">
                                    Мы подготовили 3 варианта сметы (Бюджет / Стандарт / Премиум). <br/>
                                    Оставьте телефон, чтобы получить расчет в WhatsApp или Telegram.
                                </p>
                            </div>
                            <QuizForm
                                className="space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-100"
                                onSubmitSuccess={onSubmitSuccess}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}