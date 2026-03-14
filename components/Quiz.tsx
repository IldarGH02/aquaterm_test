import React, { useState, useCallback, useMemo } from 'react';
import { QUIZ_STEPS } from '../constants';
import { ChevronLeft, Check, Gift, Timer, Calculator, ArrowRight } from 'lucide-react';
import { PhoneValidator } from '@/lib/validation/phone.validator';
import { sanitizePhone, sanitizeInput } from '@/lib/sanitization/input.sanitizer';
import { required, minLength, compose } from '@/lib/validation/form.validator';
import { useForm } from '@/hooks/useForm';
import { Input, Button } from '@/components/ui';

const ShieldCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const Quiz: React.FC<{ onSubmitSuccess?: () => void }> = ({ onSubmitSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Выбор ответа
  const handleSelect = useCallback((option: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: option }));
    if (currentStep < QUIZ_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      setTimeout(() => setIsFinished(true), 400);
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  // Валидаторы для формы контактов
  const contactFormValidators = useMemo(() => ({
    name: compose(
      required('Пожалуйста, введите ваше имя'),
      minLength(2, 'Имя должно содержать минимум 2 символа')
    ),
    phone: compose(
      required('Пожалуйста, введите номер телефона'),
      (phone: string) => PhoneValidator.validate(phone) ? null : 'Пожалуйста, введите корректный номер (8-920-123-45-67)'
    )
  }), []);

  // Хук формы для контактных данных
  const form = useForm({
    initialValues: { name: '', phone: '' },
    validators: contactFormValidators,
    autoSanitize: false,
    sanitizableFields: ['name', 'phone'],
    onSubmit: async (values) => {
      // Имитация API вызова (задержка 1.5 сек)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Сброс состояния квиза
      setCurrentStep(0);
      setAnswers({});
      setIsFinished(false);

      // Вызов SuccessModal через родительский компонент
      onSubmitSuccess?.();
    }
  });

  // Обработчики изменений с санитизацией
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeInput(rawValue);
    if (sanitized.length <= 100) {
      form.handleChange('name', sanitized);
    }
  }, [form]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^\d\s\-+()]/g, '');
    const sanitized = sanitizePhone(rawValue);
    if (sanitized.length <= 20) {
      form.handleChange('phone', sanitized);
    }
  }, [form]);

  const progress = ((currentStep + (isFinished ? 1 : 0)) / (QUIZ_STEPS.length)) * 100;

  return (
      <div className="max-w-7xl mx-auto bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-auto lg:min-h-[600px]">
        
        {/* Left Sidebar - Info Panel - СКРЫТ НА МОБИЛЯХ */}
        <div className="hidden lg:flex lg:w-[35%] bg-[#1a224f] text-white p-8 sm:p-10 md:p-14 flex-col justify-between relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d71e1e] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-white/10">
              <Calculator size={14} className="text-[#d71e1e]" />
              <span>Онлайн-расчет</span>
            </div>
            
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
                {QUIZ_STEPS[currentStep].options.map((option, idx) => {
                  const isSelected = answers[currentStep] === option;
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
                  );
                })}
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

              <form onSubmit={form.handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <Input
                    id="quiz-name"
                    label="Ваше имя"
                    type="text"
                    placeholder="Иван"
                    value={form.values.name}
                    onChange={handleNameChange}
                    maxLength={100}
                    required
                    error={form.errors.name}
                    showRequired
                    fullWidth
                  />

                  <Input
                    id="quiz-phone"
                    label="Номер телефона"
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={form.values.phone}
                    onChange={handlePhoneChange}
                    maxLength={20}
                    required
                    error={form.errors.phone}
                    showRequired
                    fullWidth
                  />
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  isLoading={form.isSubmitting}
                  fullWidth
                  rightIcon={<ArrowRight size={18} />}
                >
                  Получить расчет и скидку
                </Button>
                <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                   <ShieldCheckIcon /> <span>Ваши данные под защитой</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
  );
};

export default Quiz;
