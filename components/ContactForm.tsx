import React, { useCallback, useMemo } from 'react'
import { PhoneValidator } from '@/lib/validation/phone.validator'
import { sanitizeInput, sanitizePhone } from '@/lib/sanitization/input.sanitizer'
import { required, minLength, compose } from '@/lib/validation/form.validator'
import { useForm } from '@/hooks/useForm'
import { Input, Select, Button } from '@/components/ui'

interface ContactFormProps {
  type: 'main' | 'modal'
  onSubmitSuccess?: () => void
}

const SERVICE_OPTIONS = [
  { value: 'heating', label: 'Отопление' },
  { value: 'water', label: 'Водоснабжение' },
  { value: 'sewage', label: 'Канализация' },
  { value: 'electric', label: 'Электрощиты' },
  { value: 'complex', label: 'Комплекс под ключ' }
]

const ContactForm: React.FC<ContactFormProps> = ({ type, onSubmitSuccess }) => {
  const [isPrivacyChecked, setIsPrivacyChecked] = React.useState(false)

  // Валидаторы для формы
  const validators = useMemo(() => ({
    name: compose(
      required('Пожалуйста, введите ваше имя'),
      minLength(2, 'Имя должно содержать минимум 2 символа')
    ),
    phone: compose(
      required('Пожалуйста, введите номер телефона'),
      (phone: string) => PhoneValidator.validate(phone) ? null : 'Пожалуйста, введите корректный номер (8-920-123-45-67)'
    ),
    service: required('Выберите услугу')
  }), [])

  // Инициализация формы
  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      service: type === 'main' ? '' : 'inquiry'
    },
    validators,
    autoSanitize: false,
    sanitizableFields: ['name', 'phone'],
    onSubmit: async (values, sanitizedValues) => {
      const dataToSubmit = sanitizedValues || {
        name: values.name.trim(),
        phone: values.phone.trim(),
        service: type === 'main' ? values.service : 'inquiry',
        timestamp: new Date().toISOString()
      }

      // Сохранить локально (для тестирования)
      const existingSubmissions = JSON.parse(localStorage.getItem('aquaterm_submissions') || '[]')
      existingSubmissions.push(dataToSubmit)
      localStorage.setItem('aquaterm_submissions', JSON.stringify(existingSubmissions))

      console.log('✅ Заявка сохранена локально:', dataToSubmit)

      // Попытка отправки на backend (если есть)
      try {
        const response = await fetch('/api/contact-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSubmit)
        })
        if (response.ok) console.log('✅ Заявка отправлена на backend')
      } catch {
        console.log('ℹ️ Backend недоступен, используется локальное хранилище')
      }

      // Сброс формы и уведомление
      form.reset()
      setIsPrivacyChecked(false)
      onSubmitSuccess?.()
    }
  })

  // Обработчики изменений с санитизацией
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const sanitized = sanitizeInput(rawValue)
    if (sanitized.length <= 100) {
      form.handleChange('name', sanitized)
    }
  }, [form])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value
    rawValue = rawValue.replace(/[^\d\s\-+()]/g, '')
    const sanitized = sanitizePhone(rawValue)
    if (sanitized.length <= 20) {
      form.handleChange('phone', sanitized)
    }
  }, [form])

  const handleServiceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    form.handleChange('service', e.target.value)
  }, [form])

  // Стили для кнопки в зависимости от типа формы
  const buttonVariant = type === 'main' ? 'primary' : 'danger'

  return (
    <form onSubmit={form.handleSubmit} className='space-y-4'>
      <Input
        id='name'
        label='Ваше имя'
        type='text'
        value={form.values.name}
        onChange={handleNameChange}
        placeholder='Иван Иванов'
        maxLength={100}
        required
        error={form.errors.name}
        showRequired
        fullWidth
      />

      <Input
        id='phone'
        label='Номер телефона'
        type='tel'
        value={form.values.phone}
        onChange={handlePhoneChange}
        placeholder='+7 (920) 123-45-67'
        maxLength={20}
        required
        error={form.errors.phone}
        showRequired
        fullWidth
      />

      {type === 'main' && (
        <Select
          id='service'
          label='Тип услуги'
          value={form.values.service}
          onChange={handleServiceChange}
          options={SERVICE_OPTIONS}
          error={form.errors.service}
          required
          fullWidth
          placeholder='Выберите услугу'
        />
      )}

      <div className='flex items-start space-x-2'>
        <input
          id='privacy'
          type='checkbox'
          checked={isPrivacyChecked}
          onChange={(e) => setIsPrivacyChecked(e.target.checked)}
          required
          className='mt-1'
        />
        <label htmlFor='privacy' className='text-xs text-gray-500 leading-relaxed'>
          Я согласен с политикой конфиденциальности и обработкой персональных данных
        </label>
      </div>

      <Button
        type='submit'
        variant={buttonVariant}
        isLoading={form.isSubmitting}
        fullWidth
      >
        {form.isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </Button>

      <p className='text-[10px] text-center text-gray-400'>
        Ваши данные защищены и не будут передано третьим лицам
      </p>
    </form>
  )
}

export default ContactForm
