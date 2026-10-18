import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import GuestRoute from "@/components/layout/GuestRoute";
import { AppContentSkeleton } from "@/components/ui/Skeleton";
import LoginPageSkeleton from "@/pages/auth/LoginPageSkeleton";
import RegisterPageSkeleton from "@/pages/auth/RegisterPageSkeleton";
import SuperAdminLoginPageSkeleton from "@/pages/superadmin/SuperAdminLoginPageSkeleton";

// Auth
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const SuperAdminLoginPage = lazy(() => import("@/pages/superadmin/SuperAdminLoginPage"));

// Core Dashboard & Management
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const StoresPage = lazy(() => import("@/pages/stores/StoresPage"));
const StaffPage = lazy(() => import("@/pages/staff/StaffPage"));
const PermissionsPage = lazy(() => import("@/pages/permissions/PermissionsPage"));

// Optical POS & Sales
const POSWizardPage = lazy(() => import("@/pages/pos/POSWizardPage"));
const SalesPage = lazy(() => import("@/pages/sales/SalesPage"));
const ExchangesPage = lazy(() => import("@/pages/exchanges/ExchangesPage"));

// Inventory, Units & Aging
const ProductsPage = lazy(() => import("@/pages/inventory/ProductsPage"));
const InventoryPage = lazy(() => import("@/pages/inventory/InventoryPage"));
const ManageUnitsPage = lazy(() => import("@/pages/inventory/ManageUnitsPage"));
const DeadstockPage = lazy(() => import("@/pages/deadstock/DeadstockPage"));

// QC & Optical Lab
const DamagedItemsPage = lazy(() => import("@/pages/qc/DamagedItemsPage"));
const LabsPage = lazy(() => import("@/pages/labs/LabsPage"));
const RepairsPage = lazy(() => import("@/pages/repairs/RepairsPage"));

// Directory
const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));
const SuppliersPage = lazy(() => import("@/pages/suppliers/SuppliersPage"));
const PurchaseOrdersPage = lazy(() => import("@/pages/suppliers/PurchaseOrdersPage"));

// Finance & Expenses
const ExpensesPage = lazy(() => import("@/pages/expenses/ExpensesPage"));
const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
const LoyaltyPage = lazy(() => import("@/pages/loyalty/LoyaltyPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const BillTemplatePage = lazy(() => import("@/pages/billSettings/BillTemplatePage"));

// Accountant Portal Suite
const SalesLedgerPage = lazy(() => import("@/pages/accountant/SalesLedgerPage"));
const CustomerDuesPage = lazy(() => import("@/pages/accountant/CustomerDuesPage"));
const SupplierPaymentsPage = lazy(() => import("@/pages/accountant/SupplierPaymentsPage"));
const ProfitLossPage = lazy(() => import("@/pages/accountant/ProfitLossPage"));
const GstReportsPage = lazy(() => import("@/pages/accountant/GstReportsPage"));

// SuperAdmin Portal Suite
const SuperAdminDashboardPage = lazy(() => import("@/pages/superadmin/SuperAdminDashboardPage"));
const SuperAdminAdminsPage = lazy(() => import("@/pages/superadmin/SuperAdminAdminsPage"));
const SuperAdminStoresPage = lazy(() => import("@/pages/superadmin/SuperAdminStoresPage"));
const SuperAdminGlobalPermissionsPage = lazy(() => import("@/pages/superadmin/SuperAdminGlobalPermissionsPage"));

const SuspenseFallback = () => <AppContentSkeleton />;

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute fallback={<LoginPageSkeleton />}>
        <Suspense fallback={<LoginPageSkeleton />}>
          <LoginPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute fallback={<RegisterPageSkeleton />}>
        <Suspense fallback={<RegisterPageSkeleton />}>
          <RegisterPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/super-admin/login",
    element: (
      <GuestRoute fallback={<SuperAdminLoginPageSkeleton />}>
        <Suspense fallback={<SuperAdminLoginPageSkeleton />}>
          <SuperAdminLoginPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Suspense fallback={<SuspenseFallback />}><DashboardPage /></Suspense> },
      { path: "stores", element: <Suspense fallback={<SuspenseFallback />}><StoresPage /></Suspense> },
      { path: "staff", element: <Suspense fallback={<SuspenseFallback />}><StaffPage /></Suspense> },
      { path: "permissions", element: <Suspense fallback={<SuspenseFallback />}><PermissionsPage /></Suspense> },

      // Optical POS & Orders
      { path: "pos", element: <Suspense fallback={<SuspenseFallback />}><POSWizardPage /></Suspense> },
      { path: "sales", element: <Suspense fallback={<SuspenseFallback />}><SalesPage /></Suspense> },
      { path: "exchanges", element: <Suspense fallback={<SuspenseFallback />}><ExchangesPage /></Suspense> },

      // Inventory & Barcodes
      { path: "products", element: <Suspense fallback={<SuspenseFallback />}><ProductsPage /></Suspense> },
      { path: "inventory", element: <Suspense fallback={<SuspenseFallback />}><InventoryPage /></Suspense> },
      { path: "manage-units", element: <Suspense fallback={<SuspenseFallback />}><ManageUnitsPage /></Suspense> },
      { path: "inventory/units", element: <Suspense fallback={<SuspenseFallback />}><ManageUnitsPage /></Suspense> },
      { path: "deadstock", element: <Suspense fallback={<SuspenseFallback />}><DeadstockPage /></Suspense> },

      // QC & Clinical
      { path: "qc", element: <Suspense fallback={<SuspenseFallback />}><DamagedItemsPage /></Suspense> },
      { path: "damaged-items", element: <Suspense fallback={<SuspenseFallback />}><DamagedItemsPage /></Suspense> },
      { path: "repairs", element: <Suspense fallback={<SuspenseFallback />}><RepairsPage /></Suspense> },
      { path: "labs", element: <Suspense fallback={<SuspenseFallback />}><LabsPage /></Suspense> },

      // Customers & Vendors
      { path: "customers", element: <Suspense fallback={<SuspenseFallback />}><CustomersPage /></Suspense> },
      { path: "suppliers", element: <Suspense fallback={<SuspenseFallback />}><SuppliersPage /></Suspense> },
      { path: "purchase-orders", element: <Suspense fallback={<SuspenseFallback />}><PurchaseOrdersPage /></Suspense> },

      // Finance & Templates
      { path: "expenses", element: <Suspense fallback={<SuspenseFallback />}><ExpensesPage /></Suspense> },
      { path: "reports", element: <Suspense fallback={<SuspenseFallback />}><ReportsPage /></Suspense> },
      { path: "loyalty", element: <Suspense fallback={<SuspenseFallback />}><LoyaltyPage /></Suspense> },
      { path: "settings", element: <Suspense fallback={<SuspenseFallback />}><SettingsPage /></Suspense> },
      { path: "bill-template", element: <Suspense fallback={<SuspenseFallback />}><BillTemplatePage /></Suspense> },

      // Accountant Portal
      { path: "accountant/ledger", element: <Suspense fallback={<SuspenseFallback />}><SalesLedgerPage /></Suspense> },
      { path: "accountant/dues", element: <Suspense fallback={<SuspenseFallback />}><CustomerDuesPage /></Suspense> },
      { path: "accountant/suppliers", element: <Suspense fallback={<SuspenseFallback />}><SupplierPaymentsPage /></Suspense> },
      { path: "accountant/profit-loss", element: <Suspense fallback={<SuspenseFallback />}><ProfitLossPage /></Suspense> },
      { path: "accountant/gst", element: <Suspense fallback={<SuspenseFallback />}><GstReportsPage /></Suspense> },

      // SuperAdmin Portal
      { path: "superadmin/dashboard", element: <Suspense fallback={<SuspenseFallback />}><SuperAdminDashboardPage /></Suspense> },
      { path: "superadmin/admins", element: <Suspense fallback={<SuspenseFallback />}><SuperAdminAdminsPage /></Suspense> },
      { path: "superadmin/stores", element: <Suspense fallback={<SuspenseFallback />}><SuperAdminStoresPage /></Suspense> },
      { path: "superadmin/permissions", element: <Suspense fallback={<SuspenseFallback />}><SuperAdminGlobalPermissionsPage /></Suspense> },

      { path: "*", element: <div className="p-8 text-center text-slate-500 font-bold">404 - Page Not Found</div> },
    ],
  },
]);
