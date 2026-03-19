/**
 * Санитизатор пользовательского ввода
 * Защита от XSS и нормализация пробелов
 */

/**
 * Упрощенная санитизация для текстовых полей
 * Удаляет опасные HTML-символы и нормализует пробелы
 */
export const sanitizeText = (value: string): string => {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replace(/[<>"']/g, '') // Удаляем < > " '
    .replace(/\s+/g, ' ')    // Нормализуем множественные пробелы
    .trim()                  // Убираем пробелы в начале и конце
}

/**
 * Расширенная санитизация для текста (сохраняет некоторые символы)
 */
export const sanitizeInput = (value: string): string => {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replace(/[<>]/g, '')   // Удаляем только < и > (полезные для HTML)
    .replace(/\s+/g, ' ')   // Нормализуем пробелы
    .trim()
}

/**
 * Санитизация для текстовых полей с ограничением длины
 */
export const sanitizeWithLimit = (maxLength: number) => {
  return (value: string): string => {
    const sanitized = sanitizeInput(value)
    return sanitized.slice(0, maxLength)
  }
}

/**
 * Санитизация для телефона (оставляем только + и цифры)
 */
export const sanitizePhone = (value: string): string => {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replace(/[^\d+]/g, '') // Оставляем только цифры и +
    .replace(/(\+7|8)/, (match, p1) => p1) // Сохраняем код страны
}

/**
 * Проверка на подозрительные XSS-паттерны
 */
export const containsXSS = (value: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i, // onload, onclick, etc.
    /<\?php/i,
    /<\/?iframe/i,
    /<\/?object/i,
    /<\/?embed/i
  ]

  return xssPatterns.some(pattern => pattern.test(value))
}

/**
 * Санитизация массива значений
 */
export const sanitizeArray = (items: string[]): string[] => {
  return items.map(item => sanitizeInput(item))
}

/**
 * Глубокая санитизация объекта
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj } as T

  for (const field of fields) {
    const value = sanitized[field]
    if (typeof value === 'string') {
      sanitized[field] = sanitizeInput(value) as T[typeof field]
    }
  }

  return sanitized
}

export default {
  sanitizeText,
  sanitizeInput,
  sanitizeWithLimit,
  sanitizePhone,
  containsXSS,
  sanitizeArray,
  sanitizeObject
}
