import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утилита для объединения className с автоматическим удалением дублирующихся Tailwind классов
 * 
 * @example
 * cn('px-4 py-2', 'bg-blue-500', condition && 'text-white')
 * 
 * @example
 * cn('px-4 py-2', 'bg-red-500 hover:bg-red-600')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Алиас для cn с более коротким именем
 */
export { cn as classnames }
