# SETUP_PROMPT — Production-Grade Full-Stack Setup Specification

> This document records the complete setup specification used to build the TechSentinals Optical Store production frontend. It serves as the architectural reference and design contract for the project.

---

## Tech Stack

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- TanStack Query v5 (`@tanstack/react-query` + devtools) — server state
- Zustand — client/auth state (login/logout/user session)
- React Hook Form + Zod (`@hookform/resolvers/zod`) — forms + validation
- React Router DOM v7
- React Select
- react-hot-toast — notifications
- Axios (single configured instance with interceptors) — HTTP client
- `use-debounce` — debounced search/inputs
- lucide-react — icons

### Backend (Existing — Python FastAPI)
- FastAPI + SQLAlchemy (Async Mode via asyncpg) + Pydantic v2 + PostgreSQL
- JWT access + refresh tokens (httpOnly cookies for refresh)
- Rate limiting via SlowAPI
- CORS configured for local development

---

## Frontend Architecture Rules

1. **Every API module exports typed functions only** — no fetch calls inside components.
2. **Every mutation/query lives behind a custom hook**, never called raw in a component.
3. **Zod schema is the single source of truth** for a form; the TS type is inferred via `z.infer<typeof schema>`, never hand-duplicated.
4. **Access token is kept in memory (Zustand)**, never in localStorage. Refresh token lives only in an httpOnly cookie.
5. **TanStack Query key factories** per resource for cache management.
6. **Route-based code splitting** with `React.lazy` + `Suspense`.
7. **Zod-validated environment config** — fails loudly on missing vars.
8. **Strict TypeScript** — `strict: true`, no `any` in application code.
9. **`@/` path aliases** — no `../../../../` import chains.

---

## Auth System

- **Access token**: short-lived, stored in Zustand memory only.
- **Refresh token**: httpOnly cookie, managed entirely by the backend.
- **Axios interceptor**: on 401, silently calls `/auth/refresh` once with a single in-flight promise queue. On refresh failure, clears auth state and redirects to `/login`.
- **ProtectedRoute**: redirects to `/login` if not authenticated, shows spinner during bootstrap.
- **GuestRoute**: redirects authenticated users away from `/login`.

---

## Frontend Conventions

- **TanStack Query**: query key factories, 5-minute staleTime, global error toast on mutation failure.
- **Zustand**: `authStore` holds `user`, `accessToken`, `isAuthenticated`, `setAuth`, `clearAuth`. Never persists the access token.
- **React Hook Form + Zod**: every form uses `useForm({ resolver: zodResolver(schema) })`; disable submit while `isSubmitting`.
- **Debouncing**: `useDebounce(value, delay)` hook for search inputs feeding TanStack Query keys.
- **react-hot-toast**: single `<Toaster />` mounted in app root; success/error toasts from mutation callbacks.

---

## Documentation

- `SETUP_NOTES.md` — records all assumptions and configuration choices.
- `Frontend/CHANGELOG.md` — living changelog in Keep a Changelog format.
- This file (`SETUP_PROMPT.md`) — the architectural specification.
