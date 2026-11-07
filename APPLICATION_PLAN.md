# ColdRavine — целевая структура приложения


## Общая структура по страницам

```text
MILITARY COMMAND SYSTEM

├── Dashboard
│   ├── Statistics
│   ├── Recent Activity
│   ├── Active Operations
│   └── System Status
│
├── Operations
│   ├── Operations List
│   ├── Search
│   ├── Filters
│   ├── Add Operation
│   ├── Edit Operation
│   └── Operation Details
│
├── Personnel
│   ├── Personnel List
│   ├── Search
│   ├── Filters
│   ├── Soldier Card
│   └── Soldier Dossier
│       ├── Basic Info
│       ├── Rank / Unit / Status
│       ├── Service Record
│       ├── Skills
│       ├── Equipment
│       ├── Awards
│       └── Activity / Reports
│
├── Units
│   ├── Units List
│   ├── Search
│   ├── Filters
│   ├── Add Unit
│   ├── Edit Unit
│   └── Unit Details
│       ├── Commander
│       ├── Personnel
│       ├── Current Status
│       ├── Assigned Operations
│       └── Unit Activity
│
├── Intelligence
│   ├── Reports List
│   ├── Search
│   ├── Filters
│   ├── Threat Level
│   ├── Report Details
│   └── Attachments / Evidence
│
└── Tactical Map
    ├── Map
    ├── Markers
    ├── Units
    ├── Operations
    ├── Intelligence Points
    └── Selected Object Panel
```

## Маршруты

Я бы сразу держал в голове такую схему:

```text
/dashboard

/operations
/operations/:id

/personnel
/personnel/:id

/units
/units/:id

/intelligence
/intelligence/:id

/map

/*
→ NotFound
```

То есть `:id` — это отдельная страница конкретного объекта.

Например:

```text
/personnel/12
```

открывает досье солдата №12.

---

## Dashboard

Это не CRUD-страница.

Её задача — просто показывать сводную информацию:

```text
Dashboard
├── Active Operations: 4
├── Personnel: 128
├── Units: 12
├── Alerts: 3
│
├── Recent Activity
├── Active Operations
└── System Status
```

Позже данные сюда будут приходить из других частей системы.

Например:

```text
Operations
   ↓
Dashboard

Personnel
   ↓
Dashboard

Units
   ↓
Dashboard
```

---

## Operations

Это уже полноценная CRUD-сущность.

```text
Operations
│
├── Search
├── Status Filter
├── Priority Filter
│
├── Add Operation
│
└── Operation Cards
    ├── Name
    ├── Status
    ├── Priority
    ├── Edit
    └── Delete
```

Позже можно добавить страницу:

```text
Operation Details

Operation Alpha
├── Status
├── Priority
├── Commander
├── Assigned Units
├── Personnel
├── Objectives
└── Activity
```

---

## Personnel

Главная страница:

```text
Personnel
│
├── Search
├── Rank Filter
├── Status Filter
├── Unit Filter
│
└── Personnel Cards
    ├── Avatar
    ├── Name
    ├── Rank
    ├── Unit
    ├── Status
    └── Open Dossier
```

А досье:

```text
Soldier Dossier

[ Avatar ]
John Doe
Sergeant
Active

├── Personal Information
├── Unit
├── Specialization
├── Service Record
├── Skills
├── Equipment
├── Awards
└── Activity
```

По сути это будет что-то вроде внутреннего LinkedIn/соцсети для военной системы.

---

## Units

Главная страница:

```text
Units
│
├── Search
├── Type Filter
├── Status Filter
│
├── Add Unit
│
└── Unit Cards
    ├── Name
    ├── Type
    ├── Commander
    ├── Personnel Count
    ├── Status
    └── Open Unit
```

Страница подразделения:

```text
3rd Recon Unit

├── Commander
├── Status
├── Type
├── Personnel Count
│
├── Personnel
│   ├── Soldier
│   ├── Soldier
│   └── Soldier
│
├── Operations
│   └── Operation Alpha
│
└── Activity
```

---

## Intelligence

Тут уже можно сделать чуть более интересную страницу.

```text
Intelligence
│
├── Search
├── Type Filter
├── Threat Filter
├── Date Filter
│
└── Reports
    ├── Title
    ├── Type
    ├── Location
    ├── Threat Level
    ├── Date
    └── Open Report
```

Пример типов:

```text
Recon
SIGINT
HUMINT
Drone
Satellite
Field Report
```

Threat:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Страница отчёта:

```text
INTELLIGENCE REPORT

├── Title
├── Author
├── Date
├── Location
├── Threat Level
├── Description
├── Attachments
└── Related Operation
```

---

## Tactical Map

Это уже отдельная большая система:

```text
TACTICAL MAP

┌───────────────────────────────┐
│                               │
│             MAP               │
│                               │
│   ● Unit                      │
│           ▲ Enemy             │
│                 ◆ Operation   │
│                               │
└───────────────────────────────┘

[ Selected Object ]

Unit: 3rd Recon
Status: Active
Personnel: 24

[ Open Unit ]
```

Слои карты:

```text
☑ Friendly Units
☑ Operations
☑ Intelligence
☑ Front Line
☑ Objectives
☑ Threats
```

---

## Связи между всеми сущностями

Вот это уже самая важная архитектура:

```text
                Dashboard
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
   Operations    Units      Personnel
        │           │           │
        └──────┐    │    ┌──────┘
               ↓    ↓    ↓
              Relations
                  │
                  ↓
            Intelligence
                  │
                  ↓
            Tactical Map
```

Например:

```text
Operation Alpha
    ↓
3rd Recon Unit
    ↓
24 Soldiers
```

и:

```text
Intelligence Report
    ↓
related to Operation Alpha
    ↓
shown on Tactical Map
```

---

## По папкам

В итоге я бы целился примерно сюда:

```text
src/
│
├── pages/
│   ├── Dashboard/
│   ├── Operations/
│   ├── Personnel/
│   ├── Units/
│   ├── Intelligence/
│   ├── TacticalMap/
│   └── NotFound/
│
├── components/
│   ├── dashboard/
│   ├── operations/
│   ├── personnel/
│   ├── units/
│   ├── intelligence/
│   └── map/
│
├── types/
│   ├── Operation.ts
│   ├── Soldier.ts
│   ├── Unit.ts
│   └── Intelligence.ts
│
├── hooks/
│
├── api/
│
└── styles/
```

`hooks/` и `api/` пока можно почти не трогать. Они понадобятся сильнее, когда начнём backend.

Главная архитектурная идея проекта теперь такая:

```text
Dashboard       → обзор
Operations      → что происходит
Personnel       → кто участвует
Units           → как люди организованы
Intelligence    → что известно
Tactical Map    → где всё происходит
```

Вот это уже выглядит как цельная система, а не набор случайных страниц.


## Подготовка Junior Fullstack React/Node.js

Дополнение от 5 ноября 2026. План страниц и связей выше остаётся в силе. Учебные задачи относятся к ColdRavine / Military Command System; статусы ведутся в [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md). Новые инструменты пока не считаются частью реализованного стека.

Порядок: Jest и React Testing Library → MongoDB → bcrypt/salt и защита API → Docker/Compose → Redux Toolkit и Saga → Hapi → Event Loop и middleware → основы Kubernetes, Nginx, Redis, RabbitMQ, Elasticsearch, Ramda. Английский и подготовка к интервью идут параллельно. Проверки безопасности поддерживать на каждом этапе.

### 1. Jest и React Testing Library

Практика:
- Написать unit-тесты валидации полей и подсчёта состава подразделения: обычные значения, границы, пустые данные и неверный ввод.
- Для Personnel проверить поиск вместе с фильтрами, сброс, loading/error, 404 и пустой результат; для Login — отправку формы и ошибку входа.
- Для API проверить login/me/logout, 401 без сессии, 403 без права, доступ к чужой армии и откат создания связанных записей при ошибке. Использовать изолированную тестовую БД и очистку данных.

Готово: тесты воспроизводимо запускаются, проверяют наблюдаемое поведение и выявляют намеренно внесённую ошибку. Уметь объяснить unit/integration, mocks и async-тесты.

### 2. MongoDB

Практика: создать отдельное учебное хранилище ActivityEvent с полями armyId, entityId, eventType и createdAt. Выполнить CRUD, пагинацию и фильтрацию по армии/дате; подобрать индекс и посмотреть план запроса. Сравнить вложенные документы со ссылками и реляционной схемой PostgreSQL.

Готово: события одной армии недоступны другой; понятны назначение индекса и компромиссы модели. PostgreSQL остаётся основной БД проекта; замена и двойная запись данных не требуются.

### 3. bcrypt/salt и безопасность API

Практика:
- В отдельном упражнении реализовать bcrypt hash/compare: одинаковые пароли дают разные хеши благодаря случайной соли; неверный пароль не проходит проверку. Разобрать cost factor и формат хеша.
- Сравнить bcrypt с уже реализованным scrypt. Существующие отметки о scrypt сохраняются; миграцию действующих паролей не выполнять в рамках этого упражнения.
- Проверить валидацию, параметризованные запросы, ограничение попыток входа, HttpOnly/Secure/SameSite cookie, CSRF-защиту изменяющих запросов с cookie-сессией, настройки CORS и хранение секретов.
- Добавить негативные проверки доступа к чужим данным и запрещённым действиям. Проверить, что ответы и логи не содержат паролей, хешей и секретов.
- Объяснить сессию и JWT, срок действия и отзыв доступа, аутентификацию и авторизацию, соль и шифрование.

Готово: положительные и отрицательные сценарии доступа проверены; выбор текущего механизма паролей и сессий можно объяснить.

### 4. Docker и Docker Compose

Практика: описать сборку frontend и API, исключить локальные секреты из build context, поднять frontend/API/PostgreSQL через Compose. Добавить пример переменных без секретов, отдельный volume для БД, проверку готовности и инструкцию миграций/seed.

Готово: проект поднимается по инструкции с чистого окружения; frontend обращается к API; после перезапуска контейнеров данные сохраняются. Уметь объяснить image/container, сеть, порты и volumes.

### 5. Redux Toolkit и Redux Saga

Практика: в учебной ветке создать store, session slice и selectors; оценить, какие данные нужны нескольким страницам, сохранив локальное состояние форм. Для Personnel реализовать Saga с call/put/takeLatest, состояниями loading/error, отменой устаревшей загрузки и тестами успешного/ошибочного ответа.

Готово: сессия сбрасывается после logout, устаревший ответ не заменяет новый, компоненты не дублируют запросы. Объяснить reducer, dispatch, selector, генератор и эффект Saga. Переносить в основной проект только обоснованное общее состояние.

### 6. Hapi

Практика: в отдельном учебном модуле повторить GET списка/деталей Units, валидацию параметров, auth и единый ответ об ошибке. Использовать демонстрационные данные и тесты; сравнить routes, plugins и lifecycle Hapi с Express middleware.

Готово: корректный запрос, 400, 401 и 404 проверены; Express-приложение сохраняется, полная миграция не требуется.

### 7. Node.js Event Loop и middleware

Практика: предсказать и проверить порядок синхронного кода, Promise, таймеров и I/O, учитывая контекст выполнения. Показать, как синхронный CPU-код задерживает другие запросы. Проследить цепочку request logging → requireAuth → проверка прав → handler → error middleware и протестировать остановку цепочки при отказе.

Готово: самостоятельно объяснить async/await, microtasks, I/O и next(), порядок middleware и передачу ошибок; описать способы вынести тяжёлые вычисления.

### 8. Основы инфраструктуры и дополнительных инструментов

Эти упражнения выполняются после основных этапов, отдельно друг от друга.

| Тема | Практика в Military Command System | Критерий готовности |
| --- | --- | --- |
| Kubernetes | Запустить учебный API в локальном кластере: Deployment, Service, ConfigMap/Secret и readiness/liveness probes | Объяснить Pod, восстановление после удаления Pod и доступ через Service; не хранить реальные секреты в Git |
| Nginx | Отдавать React build, поддержать прямое открытие /personnel/:id и проксирование /api | SPA-маршрут и API работают; объяснить reverse proxy, HTTPS и основы балансировки |
| Redis | Cache-aside для сводки Dashboard с TTL и ключом, включающим armyId; инвалидация после изменения данных | Нет смешивания армий; после изменения сводка обновляется; при недоступном кеше работает основная БД |
| RabbitMQ | Передавать учебные события активности producer → queue → consumer | Есть ack, ограниченные повторные попытки и обработка неуспешных сообщений; повторная доставка не создаёт дубликат результата |
| Elasticsearch | Индексировать демонстрационные Intelligence-отчёты и искать текст с серверным фильтром armyId | Чужие отчёты не выдаются; индекс можно восстановить из основной БД; понятна задержка обновления поиска |
| Ramda | Через pipe/curry и чистые функции сгруппировать Personnel по подразделениям и посчитать статусы | Исходные данные не мутируют, результаты покрыты unit-тестами; сравнить читаемость с обычными map/filter/reduce |

### 9. Английский и интервью

- 15–20 минут 5 дней в неделю: прочитать часть документации, выписать 5 терминов и объяснить один фрагмент проекта вслух.
- Подготовить рассказ на 2–3 минуты: назначение ColdRavine, React/Node.js/PostgreSQL, поток запроса, личный вклад, сложная ошибка и её проверка.
- Раз в неделю: пробное интервью по hooks, TypeScript, Event Loop, middleware, REST, SQL JOIN, тестам, сессиям и хешированию.
- Подготовить примеры командной работы и решения проблемы по схеме STAR, вопросы интервьюеру и англоязычную демонстрацию проекта.

Готово: можно без чтения показать вход, Personnel и Units, объяснить права доступа и один технический компромисс, уточнить непонятный вопрос и описать ход решения на английском.

