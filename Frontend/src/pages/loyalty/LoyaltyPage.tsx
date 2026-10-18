export default function LoyaltyPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Loyalty Program</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Configuration</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Points per Rupee Spent</label>
              <input type="number" className="w-full border rounded p-2" defaultValue={0.1} step={0.01} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Redemption Rate (Value per Point)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue={1} step={0.1} />
            </div>
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Save Configuration</button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Manual Adjustment</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Phone</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Points to Add/Deduct</label>
              <input type="number" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">Adjust Points</button>
          </form>
        </div>
      </div>
    </div>
  );
}
