# Production Ready Optical Store Management System

This file serves as the definitive global memory and engineering rule guideline for Antigravity AI pair programming in this repository.

---

## 1. Project Tech Stack & Workspaces
* **Active Backend**: `D:\Dev\projects\PRODUCTION_READY_OPTICAL_STORE\Backend`
  - FastAPI, SQLAlchemy (Async Mode via `asyncpg`), Pydantic v2 schemas, PostgreSQL database.
* **Active Frontend**: `D:\Dev\projects\PRODUCTION_READY_OPTICAL_STORE\Frontend`
  - React (Vite-based), Tailwind CSS v4, Axios client (`axiosInstance.ts`), Zustand stores (`auth.store.ts`), TanStack Query hooks.
* **Legacy Repository (FROZEN / UNTOUCHED)**: `d:\Dev\projects\active\TechSentinals_Optical_Store`
  - Strictly read-only source reference. NEVER write or edit code in this legacy folder.

---

## 2. Directory Map (Production Ready)
* **Backend Models**: `Backend/models/` (SQLAlchemy models)
* **Backend Schemas**: `Backend/schemas/` (Pydantic validation schemas)
* **Backend Services**: `Backend/services/` (Service and business logic layers)
* **Backend APIs**: `Backend/apis/` (FastAPI request handlers, structured by feature folders)
* **Backend Routes**: `Backend/routes/` (Main router registrations)
* **Frontend APIs**: `Frontend/src/api/` (Axios API bindings)
* **Frontend Hooks**: `Frontend/src/hooks/` (TanStack query wrappers)
* **Frontend Pages**: `Frontend/src/pages/` (React components and portals)
* **Frontend Components**: `Frontend/src/components/` (UI and layout components)

---

## 3. Core Constraints & Conventions

### A. Zero Unnecessary Fields Rule (Strict API Lean Standard)
* Whenever creating or optimizing an API endpoint, component, page, or feature, the backend must fetch and return **ONLY the fields displayed on the frontend or strictly necessary for that functionality**—never even a single unnecessary field.
* This minimizes network payload, prevents serialization overhead, eliminates database overfetching, and prevents leaking sensitive data.

### B. Non-Breaking API Guarantee & Dedicated Lean Routes
* **Guarantee**: Before modifying any existing API endpoint, verify whether other internal services, scripts, background jobs, or pages depend on its shape. Never break existing APIs.
* **Dedicated Lean Routes**: If an existing route cannot be trimmed without breaking other consumers, create a dedicated lean route/endpoint tailored specifically for that component's requirements (e.g. `/feature/lean` or query parameter projections).

### C. Unique Reference Sequences (Global Uniqueness)
* Models for **Invoices** (`Sale.invoice_number`), **Purchase Orders** (`PurchaseOrder.po_number`), and **Exchanges** (`Exchange.exchange_number`) enforce a strict global unique index constraint.
* **DO NOT** count rows scoped by `admin_id` to generate sequential codes (this triggers multitenant unique constraint conflicts when other admin users are created).
* **Generation Rule**: Query the highest code prefix (e.g. `PO-2026-%`) globally using `order_by(desc())`, parse the numeric suffix, and increment it.

### D. Soft-Delete and Deactivation Behavior
* **Store Deactivation**:
  * Deleting a store via `DELETE /stores/{id}` **must only deactivate the store** (set `store.is_active = False` but leave `store.deleted_at = None`). This keeps the store visible as `INACTIVE` in dashboard lists.
  * Deactivating a store must automatically deactivate all of its associated staff (`Manager`, `Worker`, `Optician` records get `is_active = False`).
  * If a Super Admin deletes an entire Admin account, all associated store branches are hidden (they get `store.deleted_at = datetime.now()`).
* **Store-Scoped Brand/Category Deactivations**:
  * Modifying local store active status (`category.is_active` or `brand.is_active`) must write to local override tables, and the transient attribute on the model object must be set **only after** calling `db.commit()` and `db.refresh()`. Writing in-memory attributes before DB commit will cascade changes to the base global table.

### E. Admin & Permission Configuration
* On Admin creation (via Super Admin CRUD or Public Admin Registration), a copy of standard permissions must be duplicated from `GlobalRolePermission` to `AdminRolePermissionOverride` via `copy_global_permissions_to_admin()`.
