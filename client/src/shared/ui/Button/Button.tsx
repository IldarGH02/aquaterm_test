import React from 'react';
import { cn } from '@shared/lib/utils/cn.ts' // Предполагаем, что будет утилита для classnames, пока используем простой вариант

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
  const baseStyles = 'inline-flex items-center justify-center font-[Outfit] tracking-wide font-semibold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] focus:outline-none focus:ring-2 focus:ring-offset-2 outline-none'

  // Варианты (colors)
  const variants = {
    primary: 'bg-gradient-to-tr from-[#1a224f] to-[#3a4585] text-white shadow-md shadow-[#1a224f]/20 hover:shadow-lg hover:shadow-[#1a224f]/30 hover:-translate-y-0.5 focus:ring-[#1a224f]',
    secondary: 'bg-white text-[#1a224f] border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200',
    danger: 'bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5 focus:ring-red-500',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200',
    success: 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:-translate-y-0.5 focus:ring-emerald-500'
  }

  // Размеры
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base'
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
