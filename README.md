# FinanceTracker - Сервис учета финансов

Современное веб-приложение для учета личных финансов с возможностью анализа расходов и доходов по категориям.

## Возможности

- Учет расходов и доходов с категоризацией
- Стандартные категории и возможность создания собственных
- Визуализация данных с помощью круговых диаграмм
- Анализ финансов по периодам (неделя, месяц, год)
- Адаптивный дизайн для мобильных устройств и десктопов

## Технологии

### Фронтенд
- React + TypeScript
- Vite
- Redux Toolkit для управления состоянием
- React Router для маршрутизации
- Tailwind CSS для стилизации
- Chart.js для визуализации данных

### Бэкенд
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT для аутентификации

## Установка и запуск

### Предварительные требования
- Node.js (версия 14 или выше)
- MongoDB (локально или удаленно)

### Установка

1. Клонировать репозиторий:
```
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

2. Установить зависимости для бэкенда:
```
cd backend
npm install
```

3. Установить зависимости для фронтенда:
```
cd ../frontend
npm install
```

4. Настроить переменные окружения:
   - Создать файл `.env` в директории `backend` со следующими переменными:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   JWT_SECRET=your_jwt_secret_key_here
   ```

### Запуск

1. Запустить бэкенд:
```
cd backend
npm run dev
```

2. Запустить фронтенд:
```
cd frontend
npm run dev
```

3. Открыть приложение в браузере:
```
http://localhost:5173
```

## Структура проекта

### Бэкенд
- `/src/models` - Mongoose модели (User, Category, Transaction)
- `/src/controllers` - Контроллеры для обработки запросов
- `/src/routes` - Маршруты API
- `/src/middleware` - Middleware для аутентификации и обработки ошибок
- `/src/config` - Конфигурация и настройки

### Фронтенд
- `/src/components` - React компоненты
- `/src/pages` - Страницы приложения
- `/src/features` - Redux слайсы и логика
- `/src/app` - Конфигурация Redux store

## Лицензия

MIT 