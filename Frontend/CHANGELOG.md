# Changelog — Frontend

All notable changes to the frontend are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] - 2026-09-30

### Added

#### Project Setup & Tooling
- Initialized Vite 6 + React 19 + TypeScript project with strict mode (`strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`).
- Configured Tailwind CSS v4 via `@tailwindcss/vite` plugin.
- Configured `@/` path alias in `tsconfig.json` and `vite.config.ts`.
- Zod-validated environment config (`src/config/env.ts`) — fails loudly on missing `VITE_API_URL`.
- `.env.example` documenting all required environment variables.
- Vite dev server proxy: `/api` → `http://localhost:8000` (FastAPI backend).

#### Authentication System
- Zustand `auth.store.ts`: user session state with `accessToken` stored in memory only (never persisted).
- Axios instance (`src/api/axiosInstance.ts`) with:
  - Request interceptor attaching `Authorization: Bearer` header from Zustand store.
  - Response interceptor with silent 401 → `/auth/refresh` → retry pattern.
  - Single in-flight refresh promise queue preventing concurrent refresh storms.
- `useAuth` hook: `useLogin`, `useRegister`, `useLogout`, `useCurrentUser` (session bootstrap query).
- `ProtectedRoute` component: redirects unauthenticated users to `/login`, shows spinner during bootstrap.
- `GuestRoute` component: redirects authenticated users away from `/login` and `/register`.

#### State Management
- TanStack Query v5 `QueryClient` with 5-minute `staleTime`, global mutation error toasts.
- Zustand `ui.store.ts` for sidebar state (open/collapsed).
- Query key factories per resource for cache management.

#### TypeScript Domain Types (`src/types/`)
- `common.types.ts`: PaginationMeta, PaginatedResponse<T>, ApiError, SelectOption.
- `auth.types.ts`: User, UserRole, LoginRequest/Response, RegisterRequest.
- `store.types.ts`: Store, CreateStoreRequest, UpdateStoreRequest.
- `staff.types.ts`: StaffMember, Permission, RolePermission.
- `product.types.ts`: Product, Category, Brand with CRUD request types.
- `inventory.types.ts`: InventoryItem, TransferRequest.
- `sales.types.ts`: Sale, SaleItem, CreateSaleRequest.
- `customer.types.ts`: Customer with CRUD request types.
- `supplier.types.ts`: Supplier, PurchaseOrder.
- `expense.types.ts`: Expense, ExpenseCategory.
- `report.types.ts`: DashboardStats, SalesReport, StockReport.

#### API Client Layer (`src/api/`)
- Typed API modules for all backend resources: auth, stores, staff, products, inventory, sales, customers, suppliers, expenses, reports, repairs, labs, loyalty, QC.
- All functions typed with request/response interfaces, using axiosInstance.

#### TanStack Query Hooks (`src/hooks/`)
- `useAuth.ts`, `useStores.ts`, `useProducts.ts`, `useInventory.ts`, `useSales.ts`, `useCustomers.ts`, `useSuppliers.ts`, `useExpenses.ts`.
- `useDebounce.ts` for search input debouncing.
- `usePagination.ts` for table pagination state.
- Each hook uses query key factories, cache invalidation on mutations, and react-hot-toast notifications.

#### Zod Validation Schemas (`src/lib/zodSchemas/`)
- `auth.schema.ts`: loginSchema, registerSchema.
- `product.schema.ts`: createProductSchema, categorySchema, brandSchema.
- `store.schema.ts`: createStoreSchema.
- `customer.schema.ts`: createCustomerSchema.
- `expense.schema.ts`: createExpenseSchema.

#### UI Component Library (`src/components/ui/`)
- Button (variants: primary/secondary/danger/ghost/outline, sizes, loading state).
- Input (label, error state, icon, forward ref for RHF).
- Select (native select wrapper, forward ref for RHF).
- Modal (portal-based, click-outside/escape-to-close, animated).
- Card, Table (generic typed), Pagination, Badge (status variants), Spinner, ConfirmDialog.

#### Layout System (`src/components/layout/`)
- AppShell: responsive sidebar + navbar + content layout.
- Navbar: store switcher, user menu, mobile hamburger.
- Sidebar: grouped navigation links with lucide-react icons, collapsible, active route highlighting.
- StoreSwitcher: dropdown for switching active store context.

#### Pages
- Auth: LoginPage, RegisterPage (RHF + Zod forms).
- Dashboard: stats cards and quick actions.
- Stores: table with CRUD modal.
- Staff: table with role badges, store filter.
- Products: searchable table with category/brand filters, CRUD modal.
- Inventory: stock table with store filter.
- Sales: history table with date/store filters.
- Customers: searchable directory with add modal.
- Suppliers: directory + Purchase Orders page.
- Expenses: tracker with category filter and add modal.
- Reports: summary dashboard.
- Repairs: orders table.
- Labs: lab orders table.
- Loyalty: config form + points adjustment.
- Settings: bill settings + profile.

#### Router
- React Router v7 `createBrowserRouter` with lazy-loaded pages (`React.lazy` + `Suspense`).
- Route guards: ProtectedRoute (authenticated routes), GuestRoute (login/register).
- 404 catch-all page.

#### Root Components
- `App.tsx`: QueryClientProvider, RouterProvider, ReactQueryDevtools, Toaster, ErrorBoundary.
- `main.tsx`: StrictMode entry point.


## [1.1.0] - 2026-10-17

### Added

#### Optical Domain Components & Types
- `src/types/optical.types.ts`: Comprehensive binocular optometry typing (`EyePower` with SPH, CYL, AXIS, ADD, PD, Prism, Base), `LensType`, `FramePreference`, `LensCoating`, `Prescription`, and `VisionDelta`.
- `src/types/qc.types.ts`: Two-stage QC types (`QCStage`, `QCOutcome`, `DamageStatus`, `DamagedItem`, `SupplierResolutionPayload`, `LabResolutionPayload`, `CustomerContactLog`).
- `src/types/exchange.types.ts`: Optical exchange and return payloads with condition grading (`ReturnItemInput`, `ReplacementItemInput`, `CreateExchangePayload`).
- `src/types/unit.types.ts`: Serialized inventory barcodes (`ProductUnit`, `UnitStatus`, `UnitSource`, `BarcodePdfRequest`).
- `src/components/optical/OpticalPrescriptionForm.tsx`: Modern binocular OD/OS Rx cards with ±0.25D steppers, dispensing selectors, clinical notes, and skip-prescription option.
- `src/components/optical/VisionDeltaBadge.tsx`: Visual diopter delta tracking between patient visits.
- `src/components/optical/BarcodeTag.tsx`: Preview component for 50x25mm jewelry thermal barbell tags.

#### 4-Step POS Sales Wizard
- `src/store/cart.store.ts`: Optical POS cart state supporting frame & lens attachments, prescription linkage, wizard session persistence, and real-time dual GST calculation.
- `src/components/pos/WizardStepper.tsx`: Circular modern step indicator with completion states.
- `src/pages/pos/POSWizardPage.tsx`:
  - Step 1: Catalog browsing + live barcode scanning (`inventoryApi.lookupProductUnit`).
  - Step 2: Patient lookup & instant quick-create modal.
  - Step 3: Optical OD/OS prescription entry or selection.
  - Step 4: Split payment calculation (Cash, UPI, Card), dual GST (CGST 9% + SGST 9% or IGST 18%), advance deposit vs balance due, lab delivery estimation, and celebratory success screen with thermal bill printing.

#### Specialized Retail Modules
- `src/pages/exchanges/ExchangesPage.tsx`: Optical exchange register with invoice lookup, frame condition grading (Good vs Damaged), replacement picking, and net difference settlement.
- `src/pages/qc/DamagedItemsPage.tsx`: Pre-lab and post-lab QC damage resolution console (Supplier compensation/replacement/loss, Lab liability).
- `src/pages/inventory/ManageUnitsPage.tsx`: Serialized unit barcode management, printable 50x25mm PDF generation, and status controls.
- `src/pages/deadstock/DeadstockPage.tsx`: Aging stock breakdown (30/60/120/180+ days), manual aging cron trigger, and discounted markdown reactivation.
- `src/pages/billSettings/BillTemplatePage.tsx`: Invoice customizer (header, logo, UPI QR code, brand theme, live bill preview for Sales and Repairs).
- `src/pages/permissions/PermissionsPage.tsx`: Staff role defaults and override toggles with `${module}:${action}` schema.

#### Complete Accountant Suite
- `src/pages/accountant/SalesLedgerPage.tsx`: General sales ledger with dual-entry transaction records, CGST/SGST/IGST breakdown, payment mode filters, and CSV export.
- `src/pages/accountant/CustomerDuesPage.tsx`: Outstanding customer balances, advance vs remaining payments, and inline due collection with payment receipts.
- `src/pages/accountant/SupplierPaymentsPage.tsx`: Vendor payables, optical lens/frame purchase orders reconciliation, and disbursement logging.
- `src/pages/accountant/ProfitLossPage.tsx`: Real-time P&L statement, COGS calculations, gross & net margins, operating expense categorization.
- `src/pages/accountant/GstReportsPage.tsx`: Indian optical retail GST compliance (GSTR-1, GSTR-3B summaries, HSN 9001/9003/9004 tax buckets, intra vs inter-state reconciliation).

#### Complete SuperAdmin Console
- `src/pages/superadmin/SuperAdminDashboardPage.tsx`: Multi-tenant master console with cluster status, total business accounts, stores, staff, and database telemetry.
- `src/pages/superadmin/SuperAdminAdminsPage.tsx`: Tenant business admin management, registration, and active/suspension toggles.
- `src/pages/superadmin/SuperAdminStoresPage.tsx`: Global store network directory across all tenants with GSTIN and address verification.
- `src/pages/superadmin/SuperAdminGlobalPermissionsPage.tsx`: Global permission template matrix (`GlobalRolePermission`) that automatically seeds to new admins.

#### Production Build & Verification
- `npx tsc --noEmit` passing with 0 errors under strict TypeScript.
- `npm run build` completed successfully (1835 modules transformed into optimized production chunks).
