import React, { useState, useRef, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PhonePopoverProps {
  phone: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

export const PhonePopover: React.FC<PhonePopoverProps> = ({ phone, label, className, icon }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне контейнера
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible]);

  // Отслеживание фокуса для клавиатурной навигации
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        setIsVisible(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const formatPhone = (rawPhone: string) => {
    // Уже отформатирован как 8-920-800-29-05, просто возвращаем как есть
    return rawPhone;
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={(e) => {
        // Если фокус перешел внутрь контейнера, не закрываем
        if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsVisible(true);
      }}
      onBlur={(e) => {
        // Если фокус ушел внутрь контейнера, не закрываем
        if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
          return;
        }
        setIsVisible(false);
      }}
    >
      {/* Триггер (видимый номер) */}
      <a
        href={`tel:${phone.replace(/\D/g, '')}`}
        className="group inline-flex items-center font-bold text-lg hover:text-[#d71e1e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a224f] focus:ring-offset-2 rounded"
        aria-expanded={isVisible}
        aria-haspopup="true"
        tabIndex={0}
      >
        {icon ? <span className="mr-2 shrink-0">{icon}</span> : <Phone size={18} className="mr-2 shrink-0" />}
        <span className="whitespace-nowrap">{phone}</span>
      </a>

      {/* Popover */}
      {isVisible && (
        <>
          {/* Arrow */}
          <div
            className="absolute left-4 -top-1.5 w-3 h-3 bg-white rotate-45 shadow-sm z-10"
            style={{ borderTop: '1px solid #e5e7eb', borderLeft: '1px solid #e5e7eb' }}
          />

          {/* Content */}
          <div
            className={cn(
              'absolute left-0 top-4 z-20 bg-white rounded-2xl shadow-2xl p-4 min-w-[220px] max-w-[90vw]',
              'animate-in fade-in slide-in-from-top-2 duration-200',
              'border border-gray-100'
            )}
            role="dialog"
            aria-label={`Информация о номере: ${label}`}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1a224f]/10 rounded-lg shrink-0">
                  {icon ? <span className="text-[#1a224f]">{icon}</span> : <Phone size={20} className="text-[#1a224f]" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                <div className="p-2 bg-[#d71e1e]/10 rounded-lg shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#d71e1e]">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Адрес
                  </p>
                  <p className="text-sm text-[#1a224f]">
                    г. Орёл, ул. 2 Курская, дом 3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PhonePopover;
