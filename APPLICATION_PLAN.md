Да. Давай зафиксируем нормальную структуру всего приложения, чтобы дальше не было каши.

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