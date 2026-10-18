export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl mb-6">
        <h2 className="text-lg font-medium mb-4">Bill Settings</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name on Bill</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="TechSentinals Optical Store" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Footer Message</label>
            <textarea className="w-full border rounded p-2" rows={3} defaultValue="Thank you for your business!" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="showGst" defaultChecked />
            <label htmlFor="showGst" className="text-sm">Show GST Details on Bill</label>
          </div>
          <button type="button" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Save Bill Settings</button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-2xl">
        <h2 className="text-lg font-medium mb-4">User Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="Admin User" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded p-2" defaultValue="admin@example.com" disabled />
          </div>
          <button type="button" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Update Profile</button>
        </form>
      </div>
    </div>
  );
}
