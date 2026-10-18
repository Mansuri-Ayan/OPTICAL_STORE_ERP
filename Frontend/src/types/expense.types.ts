export interface ExpenseCategory {
  id: string | number;
  name: string;
  admin_id: string | number;
}

export interface Expense {
  id: string | number;
  description: string;
  amount: number;
  category_id: string | number;
  category_name?: string;
  store_id: string | number;
  date: string;
  created_at: string;
}
