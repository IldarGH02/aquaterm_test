# АКВАТЕРМ — Инженерные системы в Орле

Одностраничный корпоративный сайт компании АКВАТЕРМ: отопление, водоснабжение, водоочистка, ремонт котлов.

**Демо:** [https://vano-nine.vercel.app](https://vano-nine.vercel.app)

---

## Стек

| | |
|---|---|
| **React** | 19.2.3 |
| **TypeScript** | 5.8.2 |
| **Tailwind CSS** | 4.2.1 |
| **Vite** | 6.2.0 |
| **Lucide React** | 0.562.0 |

---

## Быстрый старт

```bash
git clone <repository-url>
cd vano
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

### Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Одновременный запуск фронта и CRM API |
| `npm run dev:front` | Только фронт (Vite) |
| `npm run dev:server` | CRM API (`http://localhost:8787`) |
| `npm run dev:crm` | Одновременный запуск фронта и CRM API |
| `npm run build` | Сборка для продакшена (`dist/`) |
| `npm run preview` | Предпросмотр продакшен-сборки |
| `npm run test:crm` | Интеграционные тесты CRM API |

---

## Структура проекта

```
vanotest/
├── components/
│   ├── ui/                  # Переиспользуемые UI-компоненты (Button, Input, Modal, Select)
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Cases.tsx
│   ├── Advantages.tsx
│   ├── Brands.tsx
│   ├── Process.tsx
│   ├── Reviews.tsx
│   ├── Quiz.tsx
│   ├── FAQ.tsx
│   ├── ContactForm.tsx
│   ├── PhonePopover.tsx
│   ├── SuccessModal.tsx
│   └── Footer.tsx
├── contexts/
│   └── ModalContext.tsx      # Глобальное управление модальными окнами
├── hooks/                    # Кастомные хуки
├── lib/                      # Утилиты
├── types/                    # TypeScript-типы
├── public/
│   ├── sitemap.xml
│   └── privacy-policy.html
├── constants.tsx             # Весь текстовый контент и конфигурационные данные
├── types.ts
├── App.tsx
├── index.tsx
└── vite.config.ts
```

---

## Архитектурные решения

- **Контент** централизован в `constants.tsx` — редактирование без правки компонентов
- **Модальные окна** управляются через `ModalContext` — консультация, вызов инженера, расчёт стоимости, success-сообщение
- **UI-компоненты** (`components/ui/`) переиспользуются по всему приложению
- **Псевдоним `@/`** настроен в `vite.config.ts` и указывает на корень проекта

---

## Цветовая схема

| | Hex | Применение |
|---|---|---|
| Primary | `#1a224f` | Фон, заголовки, основные кнопки |
| Accent | `#d71e1e` | CTA, акценты, выделения |

---

## Развёртывание

Проект настроен под Vercel (Vite, SPA). Для деплоя:

```bash
npm run build
# загрузить папку dist/ на любой статический хостинг
```

Для Vercel достаточно подключить репозиторий — платформа определит Vite автоматически.

---

## CRM v1 (SQLite + Fastify)

Добавлен внутренний CRM-модуль:

- `/crm/login` — вход сотрудников
- `/crm` — задачи с дедлайнами, приоритетами, детальной карточкой, чатом и историей
- `/crm/dashboard` — дашборд руководителя/менеджера
- `/crm/users` — управление аккаунтами (`OWNER`)

### Backend

- Node/Fastify API: `server/`
- SQLite БД: `data/crm.sqlite`
- Миграции: `server/migrations/`
- Telegram outbox-адаптер: `server/adapters/telegram.adapter.ts`

### Переменные окружения

```bash
CRM_PORT=8787
CRM_DB_PATH=./data/crm.sqlite
CRM_OWNER_LOGIN=owner
CRM_OWNER_PASSWORD=ChangeMe123!
CRM_CORS_ORIGIN=http://localhost:3000
CRM_TELEGRAM_BOT_TOKEN=
CRM_TELEGRAM_POLL_MS=15000
CRM_TIMEZONE=Europe/Moscow
```

При первом запуске создается `OWNER`-аккаунт из `CRM_OWNER_LOGIN/CRM_OWNER_PASSWORD`.

### API-эндпоинты

- `POST /api/crm/auth/login`
- `POST /api/crm/auth/logout`
- `GET /api/crm/auth/me`
- `POST /api/crm/auth/change-password`
- `GET/POST/PATCH /api/crm/tasks`
- `POST /api/crm/tasks/:id/status`
- `GET /api/crm/tasks/:id/history`
- `GET /api/crm/tasks/:id/comments`
- `POST /api/crm/tasks/:id/comments`
- `GET /api/crm/dashboard/overview`
- `GET /api/crm/dashboard/workload`
- `GET /api/crm/dashboard/completion`
- `GET/POST/PATCH /api/crm/users`
- `GET /api/crm/notifications`
- `POST /api/crm/notifications/:id/read`
- `POST /api/contact-form` (лид + автозадача менеджеру)

---

## Контакты компании

- **Email:** vansoft@yandex.ru
- **Телефон:** 8-920-800-29-05 / 8-920-818-29-05
- **Адрес:** г. Орёл, ул. 2 Курская, дом 3
- **Сайт:** [www.atrm.ru](https://www.atrm.ru)
- **Режим работы:** Пн–Пт 9:00–18:00, Сб 9:00–15:00
