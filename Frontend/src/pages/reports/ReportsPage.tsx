export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Sales Report</h3>
          <p className="text-gray-500 mb-4">View detailed sales data and trends.</p>
          <button className="text-blue-600 hover:underline">View Report</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Stock Report</h3>
          <p className="text-gray-500 mb-4">Analyze inventory levels and valuation.</p>
          <button className="text-blue-600 hover:underline">View Report</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Expense Report</h3>
          <p className="text-gray-500 mb-4">Track expenses across categories.</p>
          <button className="text-blue-600 hover:underline">View Report</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Revenue Chart (Placeholder)</h3>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
          Chart Area
        </div>
      </div>
    </div>
  );
}
