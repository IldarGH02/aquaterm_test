import React, { useState, useCallback, useMemo, FormEvent } from 'react';
import { validateForm, isFormValid, Validator, createFormValidators } from '@shared/lib/validation/form.validator.ts'
import { sanitizeObject } from '@shared/lib/sanitization/input.sanitizer.ts'

export interface UseFormConfig<T extends Record<string, any>> {
  /** Начальные значения формы */
  initialValues: T
  /** Валидаторы для каждого поля */
  validators?: { [K in keyof T]?: Validator<T[K]> | Validator<T[K]>[] }
  /** Обработчик отправки формы */
  onSubmit: (values: T, sanitizedValues?: T) => Promise<void> | void
  /** Автоматически санитизировать данные перед отправкой (по умолчанию true) */
  autoSanitize?: boolean
  /** Поля, которые нужно санитизировать (если autoSanitize=true) */
  sanitizableFields?: (keyof T)[]
}

export interface UseFormReturn<T extends Record<string, any>> {
  /** Текущие значения формы */
  values: T
  /** Ошибки валидации по полям */
  errors: Partial<Record<keyof T, string>>
  /** Флаг отправки */
  isSubmitting: boolean
  /** Флаг, указывающий, что форма была отправлена хотя бы один раз */
  isDirty: boolean
  /** Обработчик изменения поля */
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void
  /** Обработчик отправки формы */
  handleSubmit: (e?: FormEvent) => Promise<void>
  /** Сброс формы к начальным значениям */
  reset: () => void
  /** Установка значений формы */
  setValues: (values: T) => void
  /** Проверка, валидна ли форма */
  isValid: boolean
}

/**
 * Универсальный хук для управления формой
 * Инкапсулирует: state, валидацию, санитизацию, submit
 *
 * @example
 * const form = useForm({
 *   initialValues: { name: '', phone: '' },
 *   validators: {
 *     name: [required('Имя обязательно'), minLength(2)],
 *     phone: [required('Телефон обязателен'), phoneValidator]
 *   },
 *   onSubmit: async (values) => {
 *     await api.submit(values)
 *   }
 * })
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validators = {},
  onSubmit,
  autoSanitize = true,
  sanitizableFields = Object.keys(initialValues) as (keyof T)[]
}: UseFormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // СоздаемMemoized функции валидации
  const fieldValidators = useMemo(() => {
    return createFormValidators(validators)
  }, [validators])

  // Валидация одного поля
  const validateField = useCallback(<K extends keyof T>(field: K, value: T[K]): string | null => {
    const validator = fieldValidators[field]
    return validator ? validator(value) : null
  }, [fieldValidators])

  // Валидация всех полей
  const validateAll = useCallback((): Partial<Record<keyof T, string>> => {
    return validateForm(values, fieldValidators)
  }, [values, fieldValidators])

  // Обработчик изменения поля
  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)

    // Валидация в реальном времени (онлайн)
    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }))
  }, [validateField])

  // Установка значений формы
  const setFormValues = useCallback((newValues: T) => {
    setValues(newValues)
  }, [])

  // Сброс формы
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsDirty(false)
  }, [initialValues])

  // Валидность формы (computed)
  const isValid = useMemo(() => {
    return isFormValid(errors) && Object.keys(fieldValidators).every(key => {
      const validator = fieldValidators[key as keyof T]
      return validator ? !validator(values[key as keyof T]) : true
    })
  }, [errors, fieldValidators, values])

  // Обработчик отправки
  const handleSubmit = useCallback(async (e?: FormEvent) => {
    e?.preventDefault()

    // Валидация всех полей
    const newErrors = validateAll()
    setErrors(newErrors)

    if (!isFormValid(newErrors)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Санитизация (если включено)
      let sanitizedValues = values
      if (autoSanitize && sanitizableFields.length > 0) {
        sanitizedValues = sanitizeObject(values, sanitizableFields as string[]) as T
      }

      // Вызов пользовательского onSubmit
      await onSubmit(values, sanitizedValues)

      // Сброс только если onSubmit не ошибка (если не thrown)
      // reset() // Раскомментировать если нужно сбрасывать после успешной отправки
    } catch (error) {
      // Обработка ошибок на уровне компонента
      console.error('Form submission error:', error)
      throw error // Пробрасываем наверх для обработки в компоненте
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateAll, isFormValid, onSubmit, autoSanitize, sanitizableFields, reset])

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    handleChange,
    handleSubmit,
    reset,
    setValues: setFormValues,
    isValid
  }
}

export default useForm
