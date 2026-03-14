import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoCloseDelay?: number; // ms
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  title = 'Спасибо!',
  message = 'Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.',
  autoCloseDelay = 3000 
}) => {
  // ✅ Автозакрытие модального окна через несколько секунд
  useEffect(() => {
    if (!isOpen || autoCloseDelay === 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop с blur - фиксированный размер, клик закрывает */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      ></div>
      
      {/* Модальное окно - поверх backdrop */}
      <div className="bg-white rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md relative z-10 animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Декоративный элемент сверху */}
        <div className="h-1 sm:h-2 bg-gradient-to-r from-[#d71e1e] via-[#1a224f] to-[#d71e1e]"></div>

        {/* Кнопка закрытия */}
        <button 
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-[#d71e1e] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Закрыть"
        >
          <X className="w-6 sm:w-8 h-6 sm:h-8" />
        </button>

        {/* Содержимое */}
        <div className="p-6 sm:p-8 md:p-10 text-left">
          
          {/* Иконка успеха */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            <div className="relative">
              {/* Пульсирующее кольцо */}
              <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse"></div>
              <CheckCircle className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-green-500 relative z-10" />
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1a224f] uppercase tracking-wider mb-2 sm:mb-3 md:mb-4">
            {title}
          </h2>

          {/* Декоративная линия */}
          <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-[#d71e1e] rounded-full mb-4 sm:mb-6 md:mb-8"></div>

          {/* Сообщение */}
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
            {message}
          </p>

          {/* Дополнительная информация */}
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <div className="flex items-center justify-start gap-2 text-sm">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#d71e1e]"></div>
              <span className="text-gray-600">Мы получили вашу заявку</span>
            </div>
            <div className="flex items-center justify-start gap-2 text-sm">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#d71e1e]"></div>
              <span className="text-gray-600">Ожидайте звонка в течение 15 минут</span>
            </div>
            <div className="flex items-center justify-start gap-2 text-sm">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#d71e1e]"></div>
              <span className="text-gray-600">Наш специалист ответит на все вопросы</span>
            </div>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="w-full bg-[#1a224f] hover:bg-[#d71e1e] text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-[44px] uppercase tracking-widest text-sm sm:text-base"
          >
            Отлично!
          </button>

          {/* Подпись */}
          <p className="text-[10px] sm:text-xs text-gray-400 mt-4 sm:mt-6">
            Закроется автоматически через {autoCloseDelay / 1000} сек.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
