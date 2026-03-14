import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn'

export interface ModalProps {
  /** Флаг видимости модального окна */
  isOpen: boolean
  /** Колбэк при закрытии */
  onClose: () => void
  /** Дети (содержимое модального окна) */
  children: React.ReactNode
  /** Размер модального окна */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Показывать кнопку закрытия (крестик) */
  showCloseButton?: boolean
  /** Закрывать по клику на overlay */
  closeOnOverlayClick?: boolean
  /** Закрывать по Esc */
  closeOnEscape?: boolean
  /** Дополнительный класс для контейнера */
  className?: string
  /** Не показывать backdrop */
  hideBackdrop?: boolean
  /** Текст для кнопки закрытия (для доступности) */
  closeButtonLabel?: string
}

const sizeClasses = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
  xl: 'max-w-lg',
  full: 'max-w-4xl'
}

/**
 * Универсальное модальное окно с поддержкой размеров, анимаций и управляемым состоянием
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} size="md">
 *   <h2>Заголовок</h2>
 *   <p>Содержимое модального окна</p>
 *   <Button onClick={handleClose}>Закрыть</Button>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  hideBackdrop = false,
  closeButtonLabel = 'Закрыть'
}) => {
  // Обработчик нажатия Escape
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape && isOpen) {
      onClose()
    }
  }, [closeOnEscape, isOpen, onClose])

  // Блокировка скролла body при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop с blur */}
      {!hideBackdrop && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Модальное окно */}
      <div
        className={cn(
          'bg-white rounded-3xl w-full relative z-10 animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Декоративный элемент сверху */}
        <div className="h-1 sm:h-2 bg-gradient-to-r from-[#d71e1e] via-[#1a224f] to-[#d71e1e]" />

        {/* Кнопка закрытия */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-[#d71e1e] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center z-20"
            aria-label={closeButtonLabel}
          >
            <X className="w-6 sm:w-8 h-6 sm:w-8" />
          </button>
        )}

        {/* Содержимое */}
        <div className="p-6 sm:p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'

export default Modal
