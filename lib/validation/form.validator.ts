/**
 * Общие утилиты для валидации форм
 * Предоставляет composable validators для создания валидации полей
 */

export type Validator<T = string> = (value: T) => string | null

export type ValidatorChain = Validator[]

/**
 * Создает валидатор для обязательного поля
 */
export const required = (message = 'Поле обязательно'): Validator => {
  return (value: string): string | null => {
    if (value == null || value === '') {
      return message
    }
    if (typeof value === 'string' && value.trim() === '') {
      return message
    }
    return null
  }
}

/**
 * Создает валидатор для минимальной длины
 */
export const minLength = (
  min: number,
  message = `Минимум ${min} символов`
): Validator => {
  return (value: string): string | null => {
    if (value.length < min) {
      return message
    }
    return null
  }
}

/**
 * Создает валидатор для максимальной длины
 */
export const maxLength = (
  max: number,
  message = `Максимум ${max} символов`
): Validator => {
  return (value: string): string | null => {
    if (value.length > max) {
      return message
    }
    return null
  }
}

/**
 * Создает валидатор с регулярным выражением
 */
export const pattern = (
  regex: RegExp,
  message = 'Неверный формат'
): Validator => {
  return (value: string): string | null => {
    if (!regex.test(value)) {
      return message
    }
    return null
  }
}

/**
 * Создает комбинированный валидатор из цепочки
 * Выполняет валидаторы последовательно, возвращает первое сообщение об ошибке
 */
export const compose = (...validators: ValidatorChain): Validator => {
  return (value: string): string | null => {
    for (const validator of validators) {
      const error = validator(value)
      if (error) {
        return error
      }
    }
    return null
  }
}

/**
 * Создает объект валидаторов для полей формы
 * @param fields - объект, где ключ - имя поля, значение - валидатор или массив валидаторов (может быть частичным)
 * @returns объект с функциями валидации для каждого поля
 *
 * @example
 * const validators = createFormValidators({
 *   name: [required('Имя обязательно'), minLength(2, 'Минимум 2 символа')],
 *   phone: [required('Телефон обязателен'), phonePattern]
 * })
 */
export function createFormValidators<T extends Record<string, any>>(
  fields: Partial<{
    [K in keyof T]: Validator<T[K]> | Validator<T[K]>[]
  }>
): { [K in keyof T]?: Validator<T[K]> } {
  const result: Partial<Record<keyof T, Validator>> = {}

  for (const key of Object.keys(fields) as (keyof T)[]) {
    const fieldValidators = fields[key]
    if (fieldValidators) {
      const validatorArray = Array.isArray(fieldValidators)
        ? fieldValidators
        : [fieldValidators]

      result[key] = compose(...validatorArray)
    }
  }

  return result as { [K in keyof T]?: Validator<T[K]> }
}

/**
 * Валидирует все поля формы
 * @param values - значения формы
 * @param validators - объект валидаторов
 * @returns объект с ошибками (ключ - имя поля, значение - сообщение об ошибке)
 */
export function validateForm<T extends Record<string, any>>(
  values: T,
  validators: { [K in keyof T]?: Validator<T[K]> }
): { [K in keyof T]?: string } {
  const errors: Partial<Record<keyof T, string>> = {}

  for (const key of Object.keys(validators) as (keyof T)[]) {
    const validator = validators[key]
    if (validator) {
      const error = validator(values[key])
      if (error) {
        errors[key] = error
      }
    }
  }

  return errors as { [K in keyof T]?: string }
}

/**
 * Проверяет, валидна ли форма (нет ошибок)
 */
export function isFormValid<T extends Record<string, any>>(
  errors: { [K in keyof T]?: string }
): boolean {
  return Object.values(errors).every(error => error === undefined || error === null || error === '')
}

export default {
  required,
  minLength,
  maxLength,
  pattern,
  compose,
  createFormValidators,
  validateForm,
  isFormValid
}
