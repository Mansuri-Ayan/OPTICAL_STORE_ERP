export default function InventoryPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Product</th>
              <th className="p-4 font-medium text-gray-600">Store</th>
              <th className="p-4 font-medium text-gray-600">Batch</th>
              <th className="p-4 font-medium text-gray-600">Quantity</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">Ray-Ban Aviator</td>
              <td className="p-4">Main Branch</td>
              <td className="p-4">B-101</td>
              <td className="p-4">24</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">In Stock</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
