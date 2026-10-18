export default function StaffPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Staff</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Email</th>
              <th className="p-4 font-medium text-gray-600">Role</th>
              <th className="p-4 font-medium text-gray-600">Store</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">John Doe</td>
              <td className="p-4">john@example.com</td>
              <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Manager</span></td>
              <td className="p-4">Main Branch</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
