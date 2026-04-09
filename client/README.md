# АКВАТЕРМ — Инженерные системы

Корпоративный сайт + внутренняя CRM для компании АКВАТЕРМ (Орёл).

**Демо:** [https://vano-nine.vercel.app](https://vano-nine.vercel.app)

---

## Стек

| Фронтенд | Бэкенд |
|---|---|
| React 19, TypeScript | Node.js, Fastify |
| Vite, Tailwind CSS 4 | SQLite (better-sqlite3) |
| FSD-архитектура | REST API |

---

## Быстрый старт

```bash
# 1. Установить зависимости клиента
cd client
npm install

# 2. Установить зависимости сервера
cd ../api
npm install

# 3. Запустить проект (из папки client)
cd ../client
npm run dev
```

- **Фронтенд:** http://localhost:3000
- **API (CRM):** http://localhost:8787

---

## Переменные окружения

Создать файл `client/.env` (пример в `client/.env.example`):

```bash
CRM_PORT=8787
CRM_DB_PATH=./data/crm.sqlite
CRM_OWNER_LOGIN=owner
CRM_OWNER_PASSWORD=ChangeMe123!
CRM_CORS_ORIGIN=http://localhost:3000
CRM_TELEGRAM_BOT_TOKEN=
```

При первом запуске автоматически создаётся аккаунт владельца из `CRM_OWNER_LOGIN/CRM_OWNER_PASSWORD`.

---

## Скрипты (из папки `client/`)

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск фронта + сервера одновременно |
| `npm run dev:front` | Только фронтенд (Vite) |
| `npm run dev:server` | Только API-сервер |
| `npm run build` | Сборка для продакшена |
| `npm run test:crm` | Тесты CRM API |

---

## Структура проекта

```
vanotest/
├── client/                  # Фронтенд (FSD-архитектура)
│   └── src/
│       ├── app/             # Роутинг, провайдеры
│       ├── pages/           # Страницы (HomePage, CRM-страницы)
│       ├── widgets/         # Крупные блоки (Header, Footer, FAQ...)
│       ├── features/        # Фичи (ContactForm, Quiz, crm-auth)
│       ├── entities/        # Бизнес-сущности
│       └── shared/          # UI-кит, API, хуки, утилиты
├── server/                  # Fastify API
│   ├── routes/
│   ├── services/
│   ├── migrations/
│   └── index.ts
└── data/
    └── crm.sqlite           # База данных (создаётся автоматически)
```

---

## CRM

- `/crm/login` — вход сотрудников
- `/crm` — задачи с дедлайнами, приоритетами, чатом
- `/crm/dashboard` — дашборд руководителя
- `/crm/users` — управление аккаунтами (только OWNER)
