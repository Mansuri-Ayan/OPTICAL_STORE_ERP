import { useState } from "react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Product</button>
      </div>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="border p-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Category</th>
              <th className="p-4 font-medium text-gray-600">Brand</th>
              <th className="p-4 font-medium text-gray-600">SKU</th>
              <th className="p-4 font-medium text-gray-600">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">Ray-Ban Aviator</td>
              <td className="p-4">Sunglasses</td>
              <td className="p-4">Ray-Ban</td>
              <td className="p-4">RB3025</td>
              <td className="p-4">₹5,490</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
