
import React, { useState } from 'react';
import { QUIZ_STEPS } from '../constants';
import { ChevronLeft, Check, Gift, Timer, Calculator, ArrowRight } from 'lucide-react';

const ShieldCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const Quiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentStep]: option });
    // Небольшая задержка перед переходом для визуального подтверждения выбора
    if (currentStep < QUIZ_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      setTimeout(() => setIsFinished(true), 400);
    }
  };

  const handlePrev = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Заявка успешно отправлена! Инженер свяжется с вами для уточнения деталей расчета.');
      setCurrentStep(0);
      setAnswers({});
      setIsFinished(false);
    }, 1500);
  };

  const progress = ((currentStep + (isFinished ? 1 : 0)) / (QUIZ_STEPS.length)) * 100;

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Sidebar - Info Panel */}
        <div className="lg:w-[35%] bg-[#1a224f] text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
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

        {/* Right Content - Quiz Interaction */}
        <div className="lg:w-[65%] bg-white p-8 md:p-14 relative flex flex-col">
          {/* Progress bar line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
            <div 
              className="h-full bg-[#d71e1e] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(215,30,30,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {!isFinished ? (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center mb-10 md:mb-12">
                <div className="text-sm font-black text-gray-300 uppercase tracking-widest">
                  Шаг <span className="text-[#1a224f] text-lg">{currentStep + 1}</span> / {QUIZ_STEPS.length}
                </div>
                {currentStep > 0 && (
                  <button 
                    onClick={handlePrev} 
                    className="group flex items-center text-sm font-bold text-gray-400 hover:text-[#1a224f] transition-colors"
                  >
                    <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
                    Назад
                  </button>
                )}
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-[#1a224f] mb-10 leading-snug">
                {QUIZ_STEPS[currentStep].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {QUIZ_STEPS[currentStep].options.map((option, idx) => {
                  const isSelected = answers[currentStep] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(option)}
                      className={`relative text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 group flex justify-between items-start ${
                        isSelected 
                          ? 'border-[#1a224f] bg-[#1a224f] text-white shadow-xl scale-[1.02]' 
                          : 'border-gray-100 hover:border-[#d71e1e] hover:shadow-lg hover:-translate-y-1 bg-white text-[#1a224f]'
                      }`}
                    >
                      <span className="font-bold text-lg pr-8">{option}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected 
                          ? 'border-white bg-white text-[#1a224f]' 
                          : 'border-gray-200 group-hover:border-[#d71e1e]'
                      }`}>
                        {isSelected && <Check size={14} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-center animate-in zoom-in duration-500 max-w-2xl mx-auto w-full">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-[#1a224f] mb-4">Расчет готов!</h3>
                <p className="text-gray-500 text-lg">
                  Мы подготовили 3 варианта сметы (Бюджет / Стандарт / Премиум). <br/>
                  Оставьте телефон, чтобы получить расчет в WhatsApp или Telegram.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Ваше имя</label>
                    <input 
                      type="text" 
                      placeholder="Иван" 
                      required
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#d71e1e] outline-none text-[#1a224f] font-bold bg-white shadow-sm transition-all focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Телефон</label>
                    <input 
                      type="tel" 
                      placeholder="+7 (999) 000-00-00" 
                      required
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#d71e1e] outline-none text-[#1a224f] font-bold bg-white shadow-sm transition-all focus:shadow-lg"
                    />
                  </div>
                </div>
                
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#d71e1e] hover:bg-[#b01818] text-white font-black uppercase tracking-widest py-6 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center justify-center text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                       <span className="animate-spin mr-2">⏳</span> Отправка...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Получить расчет и скидку <ArrowRight className="ml-2" />
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                   <ShieldCheckIcon /> <span>Ваши данные под защитой</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
