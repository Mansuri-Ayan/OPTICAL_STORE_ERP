export default function RepairsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repairs</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Log Repair</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Device</th>
              <th className="p-4 font-medium text-gray-600">Issue</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">Alice Smith</td>
              <td className="p-4">Ray-Ban Frame</td>
              <td className="p-4">Broken hinge</td>
              <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">In Progress</span></td>
              <td className="p-4">2023-10-24</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
