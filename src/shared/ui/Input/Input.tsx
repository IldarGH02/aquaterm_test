import React, { forwardRef } from 'react';
import { cn } from '@shared/lib/utils/cn.ts'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Подпись (label) над полем */
  label?: string
  /** Текст-помощник под полем */
  helperText?: string
  /** Сообщение об ошибке (переопределяет helperText) */
  error?: string
  /** Иконка слева от input */
  leftIcon?: React.ReactNode
  /** Иконка справа от input */
  rightIcon?: React.ReactNode
  /** Размер поля */
  size?: 'sm' | 'md' | 'lg'
  /** Показывать обязательное поле (*) */
  showRequired?: boolean
  /** Полная ширина */
  fullWidth?: boolean
}

/**
 * Универсальный текстовый input с поддержкой label, error, иконок и размеров
 * 
 * @example
 * <Input 
 *   label="Ваше имя" 
 *   name="name" 
 *   value={name} 
 *   onChange={handleChange}
 *   error={errors.name}
 *   required
 * />
 * 
 * @example
 * <Input 
 *   leftIcon={<SearchIcon />}
 *   placeholder="Поиск..."
 *   fullWidth
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  size = 'md',
  showRequired = false,
  fullWidth = false,
  className,
  id,
  disabled,
  required,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  // Базовые стили input
  const baseInputStyles = 'rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-offset-0'

  // Стили для состояний
  const stateStyles = error
    ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
    : 'border-gray-200 focus:border-[#1a224f] focus:ring-[#1a224f]/20'

  // Стили для размеров
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  // Контейнер для иконок
  const wrapperClass = cn(
    'relative flex items-center',
    fullWidth && 'w-full'
  )

  // Стили самого input (с учетом иконок)
  const inputClass = cn(
    baseInputStyles,
    stateStyles,
    sizeStyles[size],
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    'bg-white',
    disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
    fullWidth && 'w-full',
    className
  )

  // Стили для label
  const labelClass = cn(
    'block text-sm font-semibold mb-1',
    error ? 'text-red-600' : 'text-gray-700'
  )

  // Стили для helper/error текста
  const helperClass = cn(
    'text-xs mt-1',
    error ? 'text-red-500' : 'text-gray-400'
  )

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className={labelClass}>
          {label}
          {(required || showRequired) && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={wrapperClass}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={inputClass}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p 
          id={error ? `${inputId}-error` : `${inputId}-helper`}
          className={helperClass}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
