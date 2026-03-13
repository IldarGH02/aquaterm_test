
import React, { useState } from 'react';

interface ContactFormProps {
  type: 'main' | 'modal';
  onSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ type, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'default'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Заявка принята! Мы перезвоним вам в течение 15 минут.');
      setFormData({ name: '', phone: '', service: 'default' });
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Ваше имя</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="Иван Иванов" 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-aquaterm-blue outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Номер телефона</label>
        <input 
          type="tel" 
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+7 (___) ___-__-__" 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-aquaterm-blue outline-none transition-colors"
        />
      </div>
      {type === 'main' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Тип услуги</label>
          <select 
            value={formData.service}
            onChange={e => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-aquaterm-blue outline-none transition-colors"
          >
            <option value="default">Выберите услугу</option>
            <option value="heating">Отопление</option>
            <option value="water">Водоснабжение</option>
            <option value="sewage">Канализация</option>
            <option value="electric">Электрощиты</option>
            <option value="complex">Комплекс под ключ</option>
          </select>
        </div>
      )}
      <button 
        disabled={isSubmitting}
        className={`w-full ${type === 'main' ? 'bg-aquaterm-blue' : 'bg-aquaterm-red'} hover:opacity-90 text-white font-bold py-4 rounded-lg transition-all shadow-md active:scale-95`}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </button>
      <p className="text-[10px] text-center text-gray-400">
        Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
      </p>
    </form>
  );
};

export default ContactForm;
