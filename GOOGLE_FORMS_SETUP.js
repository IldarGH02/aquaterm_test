// 📋 ГОТОВЫЙ КОД для интеграции Google Forms
// Скопируй это и замени в ContactForm.tsx функцию handleSubmit

import React, { useState, useCallback } from 'react';

// ✅ ШАГИ НАСТРОЙКИ:
// 1. Создай форму на https://forms.google.com
// 2. Добавь поля: Имя, Телефон, Услуга
// 3. Получи FORM_ID из URL формы
// 4. Найди entry IDs (см. инструкцию ниже)
// 5. Вставь значения в const ниже

// ════════════════════════════════════════════════════════════════
// 🔧 ШАГИ ПОЛУЧЕНИЯ GOOGLE FORM ID И ENTRY IDS:
// ════════════════════════════════════════════════════════════════

/**
 * ШАГ 1: Получить FORM_ID
 * URL Google Form выглядит так:
 * https://docs.google.com/forms/d/e/[FORM_ID]/viewform
 *                                    ^^^^^^^^
 * Вставь FORM_ID сюда:
 */
const GOOGLE_FORM_ID = 'ВСТАВЬ_ТВОЙ_FORM_ID_ЗДЕСЬ';

/**
 * ШАГ 2: Получить ENTRY_IDS
 * 
 * Как найти entry IDs (самый простой способ):
 * 1. Открой Google Form для редактирования
 * 2. Нажми на каждое поле → скопируй ID из URL
 *    (Имя → entry.123..., Телефон → entry.456..., и т.д.)
 * 
 * ИЛИ
 * 
 * Способ через браузер:
 * 1. Открой form на viewform URL
 * 2. Открой DevTools (F12) → Network
 * 3. Заполни форму и нажми Submit
 * 4. Найди запрос 'formResponse' в Network
 * 5. В Body параметра найди:
 *    entry.123456789=Иван
 *    entry.987654321=88002000600
 *    entry.555555555=heating
 * 6. Скопируй эти entry номера
 */
const ENTRY_IDS = {
  name: 'entry.123456789',      // ← ВСТАВЬ ТВОЙ ENTRY ID для "Имя"
  phone: 'entry.987654321',     // ← ВСТАВЬ ТВОЙ ENTRY ID для "Телефон"
  service: 'entry.555555555'    // ← ВСТАВЬ ТВОЙ ENTRY ID для "Услуга"
};

// ════════════════════════════════════════════════════════════════
// 📝 ПРИМЕР ГОТОВЫХ ЗНАЧЕНИЙ (тебе нужно получить свои):
// ════════════════════════════════════════════════════════════════

/**
 * ПРИМЕР 1 (Реальный пример формата):
 * 
 * const GOOGLE_FORM_ID = '1FAIpQLSc5x8qK_p9mNvL_Q2r3tU4vW5xYz6aBcDeFgHiJkLmNoPqRsTuVwXyZ';
 * const ENTRY_IDS = {
 *   name: 'entry.1234567890',
 *   phone: 'entry.0987654321',
 *   service: 'entry.1111111111'
 * };
 */

// ════════════════════════════════════════════════════════════════
// ✅ КОД ДЛЯ ВСТАВКИ В ContactForm.tsx
// ════════════════════════════════════════════════════════════════

/**
 * Замени старую функцию handleSubmit на эту:
 */
async function handleSubmitWithGoogleForms(e, formData, type, onSuccess) {
  e.preventDefault();

  // Валидация (скопируй validateForm отсюда)
  const newErrors = {};

  const nameClean = formData.name.trim();
  if (nameClean.length === 0) {
    newErrors.name = 'Пожалуйста, введите ваше имя';
  } else if (nameClean.length < 2) {
    newErrors.name = 'Имя должно содержать минимум 2 символа';
  }

  if (formData.phone.trim().length === 0) {
    newErrors.phone = 'Пожалуйста, введите номер телефона';
  }

  // Если есть ошибки - выход
  if (Object.keys(newErrors).length > 0) {
    console.error('Validation errors:', newErrors);
    return false;
  }

  try {
    // Подготовка данных
    const formDataToSend = new FormData();
    formDataToSend.append(ENTRY_IDS.name, formData.name.trim());
    formDataToSend.append(ENTRY_IDS.phone, formData.phone.trim());
    formDataToSend.append(
      ENTRY_IDS.service,
      type === 'main' ? formData.service : 'inquiry'
    );

    // Отправка на Google Forms
    // mode: 'no-cors' важен! Иначе будет CORS ошибка
    const response = await fetch(
      `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`,
      {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'  // 🔑 КРИТИЧНО! Позволяет отправлять без CORS headers
      }
    );

    // Google Forms с mode: 'no-cors' всегда возвращает 0 статус
    // Это нормально! Это означает, что форма была отправлена.

    console.log('✅ Заявка отправлена в Google Forms!');

    // Очистка формы
    // setFormData({ name: '', phone: '', service: 'default' });

    // Успешное сообщение
    alert('✅ Спасибо! Ваша заявка принята.\n\nМы свяжемся с вами в течение 15 минут.');

    // Закрыть модальное окно если нужно
    if (onSuccess) onSuccess();

    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    alert(
      '⚠️ Произошла ошибка при отправке.\n\n' +
      'Пожалуйста, позвоните нам напрямую:\n' +
      '📞 8(920)818-29-05'
    );
    return false;
  }
}

// ════════════════════════════════════════════════════════════════
// 📊 ПРОВЕРКА НАСТРОЙКИ
// ════════════════════════════════════════════════════════════════

console.log('📋 Настройка Google Forms:');
console.log('  Form ID:', GOOGLE_FORM_ID);
console.log('  Entry IDs:', ENTRY_IDS);

if (
  GOOGLE_FORM_ID === 'ВСТАВЬ_ТВОЙ_FORM_ID_ЗДЕСЬ' ||
  ENTRY_IDS.name === 'entry.123456789'
) {
  console.warn(
    '⚠️ ВНИМАНИЕ: Google Form не настроена! ' +
    'Замени GOOGLE_FORM_ID и ENTRY_IDS!'
  );
}

// ════════════════════════════════════════════════════════════════
// 🎯 АЛЬТЕРНАТИВА: EmailJS (отправка на email)
// ════════════════════════════════════════════════════════════════

/**
 * Если предпочитаешь отправку по email, используй EmailJS:
 * 
 * 1. Зарегистрируйся на https://www.emailjs.com/
 * 2. Создай email service
 * 3. Скопируй PUBLIC_KEY
 * 
 * Код:
 */

async function handleSubmitWithEmailJS(e, formData, type, onSuccess) {
  e.preventDefault();

  const EMAIL_SERVICE_ID = 'service_xxxx';
  const EMAIL_TEMPLATE_ID = 'template_xxxx';
  const EMAIL_PUBLIC_KEY = 'your_public_key';

  try {
    await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        to_email: 'info@akvaterm.ru',
        from_name: formData.name,
        from_email: 'noreply@aquaterm.local', // Фейковый email
        phone: formData.phone,
        service: formData.service,
        message: `Новая заявка с сайта. Контакт: ${formData.phone}`
      },
      EMAIL_PUBLIC_KEY
    );

    alert('✅ Заявка отправлена! Мы свяжемся в течение 15 минут.');
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error('Error:', error);
    alert('⚠️ Ошибка отправки. Позвоните: 8(920)818-29-05');
  }
}

// ════════════════════════════════════════════════════════════════
// 🧪 ТЕСТИРОВАНИЕ
// ════════════════════════════════════════════════════════════════

/**
 * Чтобы протестировать, вставь в консоль (F12):
 * 
 * const testData = {
 *   name: 'Иван Иванов',
 *   phone: '89208182905',
 *   service: 'heating'
 * };
 * 
 * handleSubmitWithGoogleForms(
 *   { preventDefault: () => {} },
 *   testData,
 *   'main',
 *   () => console.log('Success!')
 * );
 */

export { handleSubmitWithGoogleForms, GOOGLE_FORM_ID, ENTRY_IDS };
