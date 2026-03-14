import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Подпись (label) над полем */
  label?: string
  /** Текст-помощник под полем */
  helperText?: string
  /** Сообщение об ошибке */
  error?: string
  /** Массив опций */
  options: SelectOption[]
  /** Размер поля */
  size?: 'sm' | 'md' | 'lg'
  /** Показывать обязательное поле (*) */
  showRequired?: boolean
  /** Полная ширина */
  fullWidth?: boolean
  /** Текст плейсхолдера для первого пустого значения */
  placeholder?: string
}

/**
 * Универсальный select с поддержкой label, error, placeholder и размеров
 * 
 * @example
 * <Select
 *   label="Тип услуги"
 *   name="service"
 *   value={service}
 *   onChange={handleChange}
 *   options={SERVICE_OPTIONS}
 *   error={errors.service}
 *   required
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helperText,
  error,
  options,
  size = 'md',
  showRequired = false,
  fullWidth = false,
  placeholder = 'Выберите...',
  className,
  id,
  disabled,
  required,
  value,
  onChange,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  // Базовые стили
  const baseStyles = 'rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-offset-0 bg-white'

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

  const classes = cn(
    baseStyles,
    stateStyles,
    sizeStyles[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
    className
  )

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold mb-1 text-gray-700">
          {label}
          {(required || showRequired) && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        disabled={disabled}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        className={classes}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {(error || helperText) && (
        <p 
          id={error ? `${selectId}-error` : `${selectId}-helper`}
          className={cn('text-xs mt-1', error ? 'text-red-500' : 'text-gray-400')}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
