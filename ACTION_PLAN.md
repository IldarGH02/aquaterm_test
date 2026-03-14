# 🚀 План исправления по итогам аудита

**Дата:** 14 марта 2026
**Приоритет:** Критический - выполнить в течение 1-2 недель

---

## 🔴 Неделя 1: Безопасность и Foundations

### День 1-2: TypeScript Strict Mode

- [ ] Редактировать `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noEmit": false,
      "skipLibCheck": false,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true
    }
  }
  ```
- [ ] Запустить `npx tsc --noEmit` и исправить все появившиеся ошибки
- [ ] Закоммитить исправления

### День 3-4: Санитизация и XSS защита

- [ ] Установить DOMPurify: `npm install dompurify`
- [ ] Создать/обновить `lib/sanitization/xss.sanitizer.ts`:
  ```typescript
  import DOMPurify from 'dompurify';

  export const sanitizeHTML = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
  };

  export const containsXSS = (input: string): boolean => {
    const clean = sanitizeHTML(input);
    return clean !== input;
  };
  ```
- [ ] В `ContactForm.tsx` и `Quiz.tsx`:
  - Удалить `autoSanitize: false`
  - Добавить XSS проверку в валидаторы
- [ ] В `hooks/useForm.ts` убедиться, что `autoSanitize` по умолчанию `true`
- [ ] Протестировать с инъекциями: `<script>alert('xss')</script>` в поля формы

### День 5: Удаление localStorage ПДн

- [ ] В `ContactForm.tsx` найти и УДАЛИТЬ блок:
  ```typescript
  // УДАЛИТЬ:
  const existingSubmissions = JSON.parse(localStorage.getItem('aquaterm_submissions') || '[]')
  existingSubmissions.push(dataToSubmit)
  localStorage.setItem('aquaterm_submissions', JSON.stringify(existingSubmissions))
  console.log('✅ Заявка сохранена локально:', dataToSubmit)
  ```
- [ ] Оставить ТОЛЬКО отправку на `/api/contact-form`
- [ ] Добавить обработку ошибок если backend недоступен (показать ошибку пользователю)
- [ ] Удалить упоминание localStorage из кода

### День 6-7: CSRF защита

- [ ] Добавить CSRF middleware на backend (когда будет реализован)
- [ ] В `vite.config.ts` добавить CORS:
  ```typescript
  export default defineConfig({
    server: {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
      }
    }
  });
  ```
- [ ] В `ContactForm.tsx` добавить заголовок:
  ```typescript
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  const response = await fetch('/api/contact-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || ''
    },
    body: JSON.stringify(dataToSubmit)
  });
  ```
- [ ] (Backend) Валидировать CSRF token на сервере

---

## 🟡 Неделя 2: Доступность (Accessibility)

### День 1-2: Error Boundary

- [ ] Создать `components/ui/ErrorBoundary.tsx`:
  ```typescript
  import React from 'react';

  interface Props { children: React.ReactNode; }
  interface State { hasError: boolean; error?: Error; }

  export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      // TODO: Отправка в Sentry
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Произошла ошибка
              </h1>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#d71e1e] text-white rounded-lg"
              >
                Перезагрузить страницу
              </button>
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }
  ```
- [ ] Обернуть `<App />` в `ErrorBoundary` в `index.tsx`
- [ ] Протестировать: добавить ошибку в компонент, убедиться в fallback UI

### День 3: Focus Trap в Modals

- [ ] Отредактировать `components/ui/Modal/Modal.tsx` добавить:
  ```typescript
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    const focusable = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
    };

    modal?.addEventListener('keydown', handleTab);
    first?.focus();

    return () => modal?.removeEventListener('keydown', handleTab);
  }, [isOpen]);
  ```
- [ ] Протестировать: открыть модалку, табнуть - фокус не уходит за границы

### День 4: Touch Targets ≥44px

- [ ] Проверить через DevTools все интерактивные элементы
- [ ] Добавить стили:
  ```typescript
  // Кнопки:
  <button className="min-w-[44px] min-h-[44px] flex items-center justify-center">

  // Inputs:
  <input className="min-h-[44px]">

  // Все кликабельные div/span
  ```
- [ ] Особое внимание: Header toggle (menu), FAQ chevron, checkbox в форме
- [ ] Протестировать на мобильном устройстве/эмуляторе

### День 5: Color Contrast

- [ ] Запустить Lighthouse audit (Chrome DevTools)
- [ ] Или использовать axe DevTools extension
- [ ] Исправить все instances с:
  - `text-{color}/30`, `/40`, `/50` → заменить на solid `text-white` или `text-gray-300`
  - `opacity-70` → увеличить до 100%
  - Светлые placeholder'ы → `placeholder-gray-400` вместо `placeholder-gray-300`
- [ ] Особое внимание: Footer, ContactForm placeholder,subtitles
- [ ] Проверить все комбинации foreground/background

### День 6-7: ARIA атрибуты + Form validation on blur

- [ ] Add `aria-label` to all icon-only buttons:
  ```typescript
  <button aria-label="Открыть меню">
    <Menu className="w-6 h-6" />
  </button>
  ```
- [ ] Add `aria-live="polite"` and `role="alert"` to error messages:
  ```typescript
  <p id="error-name" role="alert" aria-live="polite" className="text-red-500">
    {errors.name}
  </p>
  <input aria-describedby="error-name" aria-invalid={!!errors.name} />
  ```
- [ ] Add `aria-current="page"` to active nav link
- [ ] Add `aria-expanded` to toggles:
  ```typescript
  <button aria-expanded={isOpen} aria-controls="mobile-menu">
  ```
- [ ] Add `aria-labelledby` to modals linking to title
- [ ] В `useForm` добавить `touched` state и `onBlur` handling (см. рекомендации выше)

---

## 🟢 Неделя 3: Производительность

### День 1: Оптимизация изображений

- [ ] Найти все PNG изображения в `public/`
- [ ] Конвертировать `1.png` в WebP через compression (типа Squoosh)
- [ ] Создать несколько размеров: `1-400.webp`, `1-800.webp`, `1-1200.webp`
- [ ] Обновить `<img>` теги:
  ```html
  <img
    srcSet="/1-400.webp 400w, /1-800.webp 800w, /1-1200.webp 1200w"
    sizes="(max-width: 768px) 100vw, 50vw"
    src="/1-1200.webp"
    alt="Описание"
    width={1200}
    height={675}
    loading="lazy"
  />
  ```
- [ ] Проверить размер: цель <100KB для largest size

### День 2: React.memo для тяжёлых компонентов

- [ ] Обернуть в `React.memo`:
  - `components/Hero.tsx`
  - `components/Services.tsx`
  - `components/Quiz.tsx`
  - `components/Advantages.tsx`
  - `components/Process.tsx`
- [ ] Добавить `useMemo` для производных данных:
  ```typescript
  const activeService = useMemo(() =>
    SERVICES.find(s => s.id === activeTab) || SERVICES[0],
  [activeTab]);
  ```
- [ ] Добавить `useCallback` для обработчиков событий

### День 3: Убрать Tailwind CDN

- [ ] Удалить `<script src="https://cdn.tailwindcss.com"></script>` из `index.html`
- [ ] Установить плагин: `npm install -D @tailwindcss/vite`
- [ ] В `vite.config.ts`:
  ```typescript
  import tailwindcss from '@tailwindcss/vite';
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react(), tailwindcss()]
  });
  ```
- [ ] Убедиться, что `tailwind.config.js` существует и содержит:
  ```javascript
  export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: { extend: {} },
    plugins: [],
  }
  ```
- [ ] Проверить, что стили применяются

### День 4: Code Splitting

- [ ] Добавить `React.lazy()` для тяжелых компонентов:
  ```typescript
  const Quiz = React.lazy(() => import('@/components/Quiz'));
  const Services = React.lazy(() => import('@/components/Services'));

  // В App.tsx:
  <Suspense fallback={<div>Loading...</div>}>
    <Quiz />
  </Suspense>
  ```
- [ ] Для маршрутизации (если будет) использовать ленивую загрузку страниц

### День 5-7: Исправить мобильную верстку

- [ ] Проверить на мобильном устройстве (320px width)
- [ ] Hero: уменьшить `text-4xl` до `text-2xl sm:text-3xl md:text-4xl`
- [ ] Services: изменить `grid-cols-4` на `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- [ ] FAQ: убедиться, что контент не обрезается
- [ ] Все кнопки: `w-full sm:w-auto`
- [ ] Все контейнеры: `px-4` вместо `px-8` на мобиле
- [ ] Исправить горизонтальный overflow если есть

---

## 🟢 Неделя 4: Качество кода

### День 1: Удалить неиспользуемые зависимости

```bash
npm uninstall @google/genai
npm prune
```

### День 2-3: Выделить общие компоненты

- [ ] `components/ui/layout/Section.tsx`
- [ ] `components/ui/layout/Container.tsx`
- [ ] `components/ui/cards/FeatureCard.tsx`
- [ ] `components/ui/buttons/PrimaryButton.tsx`
- [ ] `components/ui/buttons/SecondaryButton.tsx`
- [ ] Обновить все section компоненты на использование новых компонентов

### День 4: Настроить тестирование

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] Создать `vitest.config.ts`
- [ ] Добавить в `package.json`:
  ```json
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
  ```
- [ ] Написать unit тесты для:
  - `lib/validation/form.validator.test.ts`
  - `lib/validation/phone.validator.test.ts`
- [ ] Написать component тесты для:
  - `components/ContactForm.test.tsx`
  - `components/Advantages.test.tsx`

### День 5: API слой

- [ ] Создать `lib/api/client.ts`:
  ```typescript
  export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  };
  ```
- [ ] Создать `lib/api/contact.ts`:
  ```typescript
  export const submitContactForm = (data: FormData) =>
    apiClient<{ success: boolean }>('contact-form', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  ```
- [ ] Обновить `ContactForm.tsx` использовать `submitContactForm`

### День 6-7: i18n foundation

```bash
npm install i18next react-i18next
```

- [ ] Создать `locales/ru/translation.json`
- [ ] Создать `locales/en/translation.json`
- [ ] Создать `lib/i18n.ts`:
  ```typescript
  import i18n from 'i18next';
  import { initReactI18next } from 'react-i18next';

  i18n.use(initReactI18next).init({
    resources: { ru: { translation: require('../locales/ru/transition.json') } },
    lng: 'ru',
    fallbackLng: 'ru',
  });
  ```
- [ ] В `main.tsx` импортировать `lib/i18n`
- [ ] Начать миграцию текстов в компонентах на `t('key')`

---

## ✅ Приёмка и проверка

После завершения всех шагов:

1. [ ] Запустить `npx tsc --noEmit` - должно быть 0 ошибок
2. [ ] Запустить `npm run build` - должен собраться без ошибок
3. [ ] Запустить `npm run dev`, проверить в браузере
4. [ ] Запустить Lighthouse audit:
   - Performance > 85
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90
5. [ ] Протестировать на мобильном устройстве
6. [ ] Протестировать с клавиатурой (Tab, Enter)
7. [ ] Протестировать с screen reader (NVDA/VoiceOver)
8. [ ] Проверить сетевые запросы: CSRF токен отправляется
9. [ ] Проверить, что localStorage для ПДн не используется
10. [ ] Проверить, что console.log нет в production builds

---

## 📊 Метрики успеха

| Метрика | До | После |
|---------|-----|-------|
| TypeScript errors | 2+ | 0 |
| Lighthouse Performance | 45 | 85+ |
| Lighthouse Accessibility | 55 | 90+ |
| Bundle size | 500KB+ | <200KB |
| Критические уязвимости | 4 | 0 |
| Доступность (WCAG) | Fails | AA compliant |

---

**Статус:** ✨ В процессе ✨
**Ответственный:** [ разработчик ]
**Дедлайн:** [ дата ]
