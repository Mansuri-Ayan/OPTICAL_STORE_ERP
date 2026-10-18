export default function PurchaseOrdersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create PO</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">PO Number</th>
              <th className="p-4 font-medium text-gray-600">Supplier</th>
              <th className="p-4 font-medium text-gray-600">Store</th>
              <th className="p-4 font-medium text-gray-600">Amount</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">PO-2023-001</td>
              <td className="p-4">Optic Wholesale Inc.</td>
              <td className="p-4">Main Branch</td>
              <td className="p-4">₹15,000</td>
              <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span></td>
              <td className="p-4">2023-10-25</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
