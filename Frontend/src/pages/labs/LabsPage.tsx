export default function LabsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lab Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Lab Order</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Order ID</th>
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Prescription Details</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">LAB-1029</td>
              <td className="p-4">Alice Smith</td>
              <td className="p-4">OD: -2.00, OS: -1.75</td>
              <td className="p-4"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Sent to Lab</span></td>
              <td className="p-4">2023-10-24</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
