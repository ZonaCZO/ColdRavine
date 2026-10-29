# ColdRavine

An educational web application for managing fictional units, personnel, operations, and intelligence reports. The project helps you learn interface development with React and TypeScript, routing, forms, and related data, followed by backend integration.

The application is being developed in stages: the frontend, Express REST API, and basic session-based login are already partially connected; PostgreSQL, full access control, and deployment are planned. It is intended for learning scenarios and demonstration data.

## Technologies

| Technology | Purpose | Status |
| --- | --- | --- |
| React | Components and user interface | Current stack |
| TypeScript | Type definitions for components, data, and functions | Current stack |
| Vite | Frontend development environment and build tool | Current stack |
| React Router | Navigation between pages | Current stack |
| CSS | Styling, visual design, and responsive layouts | Current stack |
| Git / GitHub | Version control and repository hosting | Current toolset |

For exact dependency versions, refer to `package.json` and the repository’s lockfile.

## Current Status

| Area | Status |
| --- | --- |
| Dashboard | Frontend implemented |
| Operations | Frontend implemented |
| Personnel | API-based list and profile completed; expanded dossier features planned |
| Units | API-based list, details, personnel, and commander completed |
| Intelligence | List and Report Details scaffolds with demonstration data |
| Tactical Map | Page scaffold; map not connected yet |
| NotFound | Connected to the `*` route |
| Backend and REST API | Express with JavaScript, GET endpoints for soldiers/units, a practice POST endpoint, and in-memory arrays |
| PostgreSQL | Planned |
| Authentication and access control | Login/logout, sessions, and API protection completed; React session checks and roles planned |
| Deployment | Planned |

This status reflects the project description. An implemented frontend does not imply persistent server-side storage, a complete API, or support for all CRUD workflows.

## Pages and Routes

| Module | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/dashboard` | Summary statistics, active operations, recent events, and system status |
| Operations | `/operations` | Operation list, search, filtering, and management |
| Operation Details | `/operations/:id` | Information about the selected operation and assigned units |
| Personnel | `/personnel` | Personnel list, search, and filters |
| Soldier Dossier | `/personnel/:id` | Dossier: basic information, rank, unit, status, and service history |
| Units | `/units` | Unit list, search, filters, and management |
| Unit Details | `/units/:id` | Commander, personnel, status, assigned operations, and activity |
| Intelligence | `/intelligence` | Intelligence reports, search, filters, and threat levels |
| Report Details | `/intelligence/:id` | Report content, related entities, and materials |
| Tactical Map | `/map` | Demonstration map with entity markers and a selected entity panel |
| NotFound | `*` | Page for unknown URLs |

This is the intended route structure. Detail pages and planned module features may be introduced gradually. Currently, `/` redirects to `/login`. The login page uses the `/login` route.

## Proposed Architecture

The frontend is organized around individual domain modules and reusable components:

```text
Browser
  └─ React + React Router
      ├─ Module pages and components
      ├─ UI state and form validation
      └─ Data access layer
          ├─ Demonstration data — during frontend development
          └─ REST API — after backend integration
              └─ Express + TypeScript
                  ├─ Routes and middleware
                  ├─ Input validation and authorization
                  ├─ Domain logic services
                  └─ PostgreSQL data access layer
```

- **Pages** organize screens, data loading, and component interactions.
- **Components** display cards, forms, filters, and shared interface elements.
- **Types** describe entities and data contracts.
- **The API layer** separates network requests from the interface.
- **The backend** validates requests, applies access permissions, and stores data.

Local React state and passing data through props are sufficient at the first stage. Shared state management should be introduced as data used by multiple pages emerges. Dashboard should obtain summary metrics from the same sources as the other modules.

## Recommended Folder Structure

The following is a proposed structure, not a verified representation of the current repository:

```text
military-command-system/
├─ public/                       # Static files
├─ src/
│  ├─ assets/                    # Images and other assets
│  ├─ components/
│  │  ├─ common/                 # Buttons, modals, empty states
│  │  ├─ layout/                 # Shared layout, sidebar, header
│  │  ├─ operations/             # Operation cards, forms, and filters
│  │  ├─ personnel/              # Personnel components
│  │  ├─ units/                  # Unit components
│  │  ├─ intelligence/           # Report components
│  │  └─ map/                    # Map components
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  ├─ Operations.tsx
│  │  ├─ OperationDetails.tsx
│  │  ├─ Personnel.tsx
│  │  ├─ SoldierDossier.tsx
│  │  ├─ Units.tsx
│  │  ├─ UnitDetails.tsx
│  │  ├─ Intelligence.tsx
│  │  ├─ ReportDetails.tsx
│  │  ├─ TacticalMap.tsx
│  │  └─ NotFound.tsx
│  ├─ routes/                    # Route configuration
│  ├─ types/                     # Domain entity types
│  ├─ data/                      # Demonstration data
│  ├─ services/                  # Future REST API client
│  ├─ hooks/                     # Reusable React hooks
│  ├─ utils/                     # Utility functions
│  ├─ styles/                    # Shared and module styles
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ package.json
├─ package-lock.json             # When using npm
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

The backend can be placed in a separate repository or added under a `server/` directory. A decision on using a monorepo has not yet been finalized.

## Data and Entities

Proposed data model:

| Entity | Main Fields | Relationships |
| --- | --- | --- |
| Operation | `id`, `name`, `description`, `status`, dates | Assigned units, related reports |
| Soldier | `id`, `name`, `rank`, `status`, `unitId` | Unit, service history records |
| Unit | `id`, `name`, `type`, `status`, `commanderId` | Personnel, commander, operations |
| IntelligenceReport | `id`, `title`, `content`, `threatLevel`, `createdAt` | Operation, author, attachments |
| MapMarker | `id`, `coordinates`, `entityType`, `entityId` | Entity displayed on the map |
| ActivityEvent | `id`, `eventType`, `entityId`, `createdAt` | Entity change history |
| User | `id`, `displayName`, `role` | Future authentication and access control |

Names and fields are preliminary. Final types and the database schema will be refined during implementation.

Proposed relationship rules:

- A soldier belongs to one unit or is temporarily unassigned.
- A unit contains multiple soldiers; its commander is specified by a reference to a personnel record.
- An operation can involve multiple units. Assignment history can be stored through a separate `OperationUnit` entity.
- Unit strength is calculated from its personnel to avoid discrepancies with a manually stored value.
- A map marker references an entity without duplicating its main information.
- Dashboard displays calculated metrics rather than separate copies of module data.

Use fictional data during development. After backend integration, PostgreSQL will become the persistent data source.

## Running Locally

### Requirements

- A Node.js version compatible with the installed Vite version, preferably a supported LTS release.
- npm and Git.
- Access to the project repository.

### Installation and Startup

Replace the URL below with your repository URL:

```bash
git clone <repository-url>
cd military-command-system
npm install
npm run dev
```

Open the address printed by Vite in the terminal. It is usually `http://localhost:5173`, but the port may differ.

If the repository contains an up-to-date `package-lock.json`, you can use `npm ci` instead of `npm install` for reproducible installation.

### Build and Preview

```bash
npm run build
npm run preview
```

These commands assume standard Vite scripts in `package.json`. Check that they exist before using them. `preview` is intended for viewing the build locally.

When connecting the API in the future, you can add an `.env.local` file:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
```

This is a proposed configuration: it will work after the API client is implemented. `VITE_*` variables are accessible in the browser, so they must not contain passwords, private keys, or other secrets. A configuration example without secrets can be saved in `.env.example`.

## Git Workflow

Recommended workflow:

1. Update your local `main` branch.
2. Create a separate branch for one task.
3. Make changes and check the affected UI workflows.
4. Run the build and available project checks.
5. Create clear commits, push the branch, and open a Pull Request.
6. After review, merge the changes into `main`.

```bash
git switch main
git pull --ff-only
git switch -c feat/units-page

# After making and checking changes:
git add src/
git commit -m "feat: add units page"
git push -u origin feat/units-page
```

Example branch names: `feat/personnel-page`, `fix/operation-filter`, `docs/update-readme`. Commit messages can use prefixes such as `feat:`, `fix:`, `refactor:`, and `docs:`.

Review the list of changes before committing. Do not add `node_modules/`, `dist/`, local `.env` files containing secrets, or editor-specific files. Exclusion rules should be defined in `.gitignore`.

## Roadmap

### Stage 1 — Frontend

- [x] Implement the Dashboard frontend.
- [x] Implement the Operations frontend.
- [x] Implement basic Personnel and soldier profiles; expanded dossier sections are planned.
- [x] Implement basic Units and a unit page with personnel and commander information.
- [x] Prepare Intelligence and Report Details scaffolds.
- [ ] Implement complete Intelligence data, search, and filters.
- [x] Prepare the Tactical Map scaffold.
- [ ] Connect the map, markers, and layers.
- [ ] Complete detail routes and NotFound.
- [ ] Standardize forms, filters, search, and empty-list states.
- [ ] Check responsiveness, keyboard navigation, and form accessibility.

### Stage 2 — Backend and Data

- [x] Create a practice server with Node.js + Express (JavaScript).
- [ ] Migrate the backend to TypeScript if needed.
- [ ] Design PostgreSQL tables, relationships, and migrations.
- [x] Implement GET APIs for Personnel and Units.
- [ ] Implement Operations/Intelligence APIs and data modification endpoints with access control.
- [ ] Add server-side data validation and a consistent error format.
- [x] Connect Personnel, SoldierProfile, Units, and UnitDetails to the API with loading and error states.
- [ ] Connect the remaining modules to the API.
- [ ] Add tests for key workflows and API integration.

### Stage 3 — Access and Deployment

- [x] Implement basic login/logout, GET me, in-memory sessions, and cookies.
- [x] Implement the Login form, navigation to Dashboard, logout button, and API protection.
- [ ] Current step: check me when React starts and protect pages.
- [ ] Implement password hashing and complete the access model.
- [ ] Define roles and enforce access permissions on the server.
- [ ] Configure development and production environments.
- [ ] Configure automated checks and builds in GitHub.
- [ ] Deploy the frontend, backend, and database.
- [ ] Configure logging and database backups.
- [ ] Configure encryption and hashing.

## Backend: Current and Planned

| Technology | Intended Purpose |
| --- | --- |
| Node.js | Running the server application |
| Express | HTTP routes, middleware, and REST API |
| TypeScript | Server-side type checking |
| PostgreSQL | Persistent storage of data and relationships |

The `/api/soldiers`, `/api/units`, `/api/auth/login`, `/api/auth/me`, and `/api/auth/logout` endpoints are implemented. `/api/operations` and `/api/intelligence` are planned. Request contracts, pagination, filtering, and an ORM or SQL client will be selected later. The current login implementation uses express-session; army isolation and permissions have not yet been implemented.

Database credentials and authentication settings must be stored in the server environment. PostgreSQL is accessed through the backend.

## Possible Desktop Version

In the future, the web interface could be adapted into a desktop application using **Electron** or **Tauri**. The choice will require evaluating application size, system integration, updates, and API connectivity. Tauri will also require working with Rust tooling.

Electron and Tauri are not currently part of the project stack. A desktop version is considered a separate future direction after the web application has stabilized.

## License

**TODO: choose a license and add a `LICENSE` file.**

The license has not yet been determined. Once selected, specify its name and terms of use in this section.
