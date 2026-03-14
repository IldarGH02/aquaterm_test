import React from 'react';
import { cn } from '@/lib/utils/cn' // Предполагаем, что будет утилита для classnames, пока используем простой вариант

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Визуальный вариант кнопки */
  variant?: ButtonVariant
  /** Размер кнопки */
  size?: ButtonSize
  /** Показывать индикатор загрузки */
  isLoading?: boolean
  /** Иконка слева */
  leftIcon?: React.ReactNode
  /** Иконка справа */
  rightIcon?: React.ReactNode
  /** Растягивать на всю ширину */
  fullWidth?: boolean
  /** Дети (содержимое) */
  children: React.ReactNode
}

/**
 * Универсальная кнопка с поддержкой вариантов, размеров, иконок и состояния загрузки
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Отправить
 * </Button>
 * 
 * @example
 * <Button isLoading leftIcon={<Spinner />}>
 *   Загрузка...
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Базовые стили
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2'

  // Варианты (colors)
  const variants = {
    primary: 'bg-[#1a224f] text-white hover:bg-[#2a3575] focus:ring-[#1a224f]',
    secondary: 'bg-white text-[#1a224f] border-2 border-[#1a224f] hover:bg-[#1a224f] hover:text-white focus:ring-[#1a224f]',
    danger: 'bg-[#d71e1e] text-white hover:bg-[#b01818] focus:ring-[#d71e1e]',
    ghost: 'bg-transparent text-[#1a224f] hover:bg-gray-100 focus:ring-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600'
  }

  // Размеры
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
    xl: 'px-12 py-6 text-xl'
  }

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  )

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin mr-2" aria-hidden="true">⏳</span>
      )}
      
      {!isLoading && leftIcon && (
        <span className="mr-2" aria-hidden="true">{leftIcon}</span>
      )}

      {children}

      {!isLoading && rightIcon && (
        <span className="ml-2" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  )
}

export default Button
