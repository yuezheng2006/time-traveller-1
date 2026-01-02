# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It is synchronized with the Cursor rules in `.cursor/rules/`.

## Development Commands

### Running the Application
```bash
# Terminal 1: Start Motia backend (port 3000)
npm run backend

# Terminal 2: Start Vite frontend (port 5173)
npm run dev
```

### Building
```bash
# Build frontend for production
npm run build

# Build Motia backend
npm run backend:build

# Start production backend
npm run backend:start
```

### Deployment
```bash
# Deploy to Motia Cloud via CLI
npx motia cloud deploy \
  --api-key <MOTIA_API_KEY> \
  --project-name time-traveller \
  --environment-id <MOTIA_ENV_ID> \
  --version-name v1.0.0 \
  --env-file .env
```

## Architecture Overview

### Motia Framework Backend
This project uses **Motia**, a TypeScript backend framework with visual workflow capabilities. The backend runs on port 3000 and includes a built-in Workbench UI for monitoring and debugging.

**Key Concepts:**
- **Steps**: The fundamental building blocks in Motia (API endpoints, event handlers, streams, cron jobs, noop steps).
- **Flows**: Visual groupings of related steps in the Workbench.
- **State**: Built-in Redis-backed state management via `state.set()` and `state.get()`.
- **Streams**: Real-time data streaming to frontend via WebSocket.
- **Events**: Asynchronous background tasks triggered via `emit()`.

### Backend Structure (`steps/`)

All backend logic lives in the `steps/` directory, organized by type:

**`steps/api/`** - HTTP REST endpoints
- Each file exports `config: ApiRouteConfig` and `handler: Handlers['StepName']`.
- Use `middleware: [authRequired]` for protected endpoints.
- Define schemas with Zod for request/response validation.
- Example: `initiateTeleport.step.ts`.

**`steps/events/`** - Background event handlers
- Triggered asynchronously via `emit({ topic: 'event-name', data: {...} })`.
- Subscribe to topics via `subscribes: ['topic-name']` in config.
- Example: `generateImage.step.ts`.

**`steps/streams/`** - Real-time WebSocket streams
- Push live updates to frontend via `streams.streamName.set('channel', key, data)`.
- Example: `teleportProgress.stream.ts`.

**`steps/middlewares/`** - Request middleware
- Authentication, validation, error handling.
- Example: `auth.middleware.ts`.

### Service Layer (`services/`)

Business logic separated from steps following Domain-Driven Design:
- **`services/gemini/`**: AI services (image, location, TTS, command parsing).
- **`services/google/`**: Google Maps integration (Street View, geocoding).
- **`services/supabase/`**: Authentication & storage.

## Motia Development Patterns

### Creating API Endpoints (API Steps)
- File naming: `kebab-case.step.ts`.
- Must export `config: ApiRouteConfig` and `handler: Handlers['Name']`.
- Use Zod schemas for `bodySchema` and `responseSchema`.
- Always include `flows: ['flow-name']` for Workbench visualization.

### Creating Background Tasks (Event Steps)
- File naming: `kebab-case.step.ts`.
- Must export `config: EventConfig` and `handler: Handlers['Name']`.
- Use `subscribes: ['topic']` to trigger the handler.
- For long-running tasks (LLM, image generation), use events to avoid timeouts.

### Scheduled Tasks (Cron Steps)
- File naming: `kebab-case.step.ts`.
- Must export `config: CronConfig` (type: 'cron', cron: 'expression') and `handler`.
- Example expressions: `0 0 * * *` (daily), `*/5 * * * *` (every 5 min).

### Visual Workflows (Virtual & NOOP Steps)
- **NOOP Steps**: Used for manual triggers or UI overrides in Workbench.
- Export `config: NoopConfig` (type: 'noop'). No handler needed.
- Use `virtualEmits` and `virtualSubscribes` to create connections in Workbench without actual logic execution.

### Custom UI for Workbench (UI Steps)
- Create a `.tsx` file next to the `.step.ts` file (e.g., `my-step.step.tsx`).
- Export a `Node` component using `EventNode`, `ApiNode`, `CronNode`, or `NoopNode` from `motia/workbench`.
- Use Tailwind CSS for styling.

### State & Cache Management
- Use `await state.set(namespace, key, value)` and `await state.get(namespace, key)`.
- Shared state is persisted across steps.

## Frontend Structure (`frontend/`)

React 19 + Vite application:
- `apiClient.ts`: Handles API calls and authentication headers.
- `contexts/AuthContext.tsx`: Manages user session with Supabase.
- `components/`: Modular UI components using Tailwind CSS.

## Environment Variables
- `GEMINI_API_KEY`: Required for AI generation.
- `GOOGLE_API_KEY`: Required for maps/location services.
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: Required for backend data.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Required for frontend auth.

## File Naming Conventions
- API/Event/Cron/Noop Steps: `kebab-case.step.ts`
- Services: `camelCase.ts`
- Frontend Components: `PascalCase.tsx`
- Frontend Utilities: `camelCase.ts`
- Contexts: `PascalCase.tsx`

## Important Notes
- **Workbench Access**: `http://localhost:3000` for visual debugging.
- **Zod Schemas**: Use `@ts-expect-error` comments when assigning schemas to Motia config objects.
- **Type Safety**: Use `Handlers['StepName']` for handlers to ensure type safety with auto-generated types.
