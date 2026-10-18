# SETUP_NOTES.md — TechSentinals Optical Store Production Setup

## Assumptions & Decisions Made

### Project Structure
- **Two-folder layout** (`/Backend`, `/Frontend`) rather than a monorepo. The backend is an existing Python FastAPI application; the frontend is a brand-new React + TypeScript SPA.
- The backend was copied intact from `TechSentinals_Optical_Store/Backend` — no modifications to Python code, routes, or database models.

### Frontend Technology Choices
- **React 19** — latest stable, used with TypeScript strict mode.
- **Vite 6** — build tool, configured with `@/` path alias mapping to `src/`.
- **Tailwind CSS v4** — using the new `@import "tailwindcss"` directive (no `tailwind.config.js` needed).
- **Zod v3** — chosen over Zod v4 for ecosystem compatibility with `@hookform/resolvers` and `@tanstack/react-query`.
- **react-hot-toast** — used instead of react-toastify (from the old frontend) per the setup specification.
- **use-debounce** package — used for debounced search inputs rather than a hand-rolled hook, for reliability.

### Authentication Architecture
- **Access token**: stored in Zustand memory store only — never in localStorage, never in a cookie readable by JS.
- **Refresh token**: managed entirely by the FastAPI backend as an httpOnly cookie. The frontend never reads or writes this cookie directly.
- **Axios interceptor**: on 401 response, silently calls `/auth/refresh` once with a single in-flight promise queue pattern to prevent concurrent refresh storms. On refresh failure, clears auth state and redirects to `/login`.

### State Management
- **Server state**: TanStack Query v5 with query key factories per resource. `staleTime` set to 5 minutes globally.
- **Client state**: Zustand for auth session (`user`, `accessToken`, `storeId`) and UI state (`sidebarOpen`, `sidebarCollapsed`). No persistence middleware on auth store — access token must not survive page reload (user re-authenticates via refresh cookie).

### API Proxy
- Vite dev server proxies `/api` requests to `http://localhost:8000` (the FastAPI backend) to avoid CORS issues during development.
- In production, Nginx handles this reverse proxy.

### Code Splitting
- All page components are lazy-loaded via `React.lazy` + `Suspense` in the router to keep the initial bundle small.

### TypeScript Strictness
- `strict: true`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch` — all enabled.
- No `any` types in application code.

### Styling
- Tailwind CSS v4 utility-first approach. No CSS-in-JS, no styled-components.
- `clsx` + `tailwind-merge` combined into a `cn()` utility for conditional class merging without Tailwind conflicts.
- lucide-react for all icons.

### Form Handling
- Every form uses `react-hook-form` with `zodResolver` — Zod schema is the single source of truth for validation.
- Form types are inferred via `z.infer<typeof schema>`, never manually duplicated.
- Server-side validation errors are surfaced back into RHF via `setError`.

### Route Guards
- `ProtectedRoute`: checks `isAuthenticated` from Zustand store. Shows a full-page spinner while the initial `/auth/me` bootstrap query resolves. Redirects to `/login` if unauthenticated.
- `GuestRoute`: redirects already-authenticated users away from `/login` and `/register` to `/dashboard`.


### Optical Domain Architecture & Portals
- **Optical Rx Schema**: Implements binocular OD (Right Eye) and OS (Left Eye) optical prescriptions with SPH (-20.00 to +20.00), CYL (-6.00 to +6.00), AXIS (1-180°), ADD (+0.75 to +4.00), and pupillary distance (PD: Mono 20-40mm, Binocular 45-80mm).
- **POS 4-Step Sales Flow**: Built into `POSWizardPage.tsx` using `useCartStore`, combining live barcode lookups (`inventoryApi.lookupProductUnit`), patient quick-create, prescription attachment, split payments (Cash, UPI, Card), dual GST (CGST 9% + SGST 9% or IGST 18%), and balance due calculation.
- **QC & Damaged Stock**: Two-stage quality control engine (`DamagedItemsPage.tsx`) covering Pre-Lab manufacturing defects and Post-Lab glazing/edging failures, with supplier reimbursement, replacement, or store write-off settlement.
- **Serialized Unit Barcoding**: Tracks individual optical frames and sunglasses using `ProductUnit` SKUs and generates printable thermal jewelry barbell tags (50x25mm).
- **Role Portals**: Complete modular portal architecture covering SuperAdmin (multi-tenant governance, admin registrations, global permission templates), Admin/Shopkeeper (POS, stock, staff, repairs, labs), and Accountant (sales ledger, customer dues collection, vendor payments, P&L, GSTR-1 & HSN summaries).
