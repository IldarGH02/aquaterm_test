import { useCallback, useState, FC, ChangeEvent } from 'react'
import { sanitizeInput, sanitizePhone } from '@shared/lib/sanitization/input.sanitizer.ts'
import { contactFormValidators } from "@features/ContactForm/ui/validator.ts";
import { useForm } from '@features/hooks/useForm.tsx'
import { Input, Select, Button } from '@shared/ui'

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

export const ContactForm: FC<ContactFormProps> = ({ type, onSubmitSuccess }) => {
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false)
  const validators = contactFormValidators

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

      // Отправка на backend (если endpoint доступен)
      try {
        await fetch('/api/contact-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSubmit)
        })
      } catch {
        // На фронте без backend не блокируем UX: форма закрывается как обычно.
      }

      // Сброс формы и уведомление
      form.reset()
      setIsPrivacyChecked(false)
      onSubmitSuccess?.()
    }
  })

  // Обработчики изменений с санитизацией
  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const sanitized = sanitizeInput(rawValue)
    if (sanitized.length <= 100) {
      form.handleChange('name', sanitized)
    }
  }, [form])

  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value
    rawValue = rawValue.replace(/[^\d\s\-+()]/g, '')
    const sanitized = sanitizePhone(rawValue)
    if (sanitized.length <= 20) {
      form.handleChange('phone', sanitized)
    }
  }, [form])

  const handleServiceChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
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

      <p className='text-xs text-center text-gray-400'>
        Ваши данные защищены и не будут переданы третьим лицам
      </p>
    </form>
  )
}
