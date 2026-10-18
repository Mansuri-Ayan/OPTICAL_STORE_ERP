export interface DashboardStats {
  total_sales: number;
  total_customers: number;
  total_orders: number;
  revenue: number;
}

export interface SalesReport {
  date: string;
  total_sales: number;
  revenue: number;
}

export interface StockReport {
  product_id: string | number;
  product_name: string;
  quantity: number;
  value: number;
}

export interface ExpenseReport {
  category: string;
  total_amount: number;
}
