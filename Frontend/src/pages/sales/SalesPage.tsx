export default function SalesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Sale</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Invoice #</th>
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
              <th className="p-4 font-medium text-gray-600">Amount</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">INV-1001</td>
              <td className="p-4">Alice Smith</td>
              <td className="p-4">2023-10-25</td>
              <td className="p-4">₹2,500</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
