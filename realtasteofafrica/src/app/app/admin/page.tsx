import React from 'react';

// This is a simple server-side check for a secret "Admin Key"
export default function AdminPage({ searchParams }: { searchParams: { key: string } }) {
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY; // We will set this in Vercel later

  if (searchParams.key !== ADMIN_KEY) {
    return <div className="p-20 text-center">Unauthorized. Texas is watching. 🤠</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Texas African Food Directory Admin</h1>
      <p className="mb-8 text-gray-600">Managing 175 Verified Listings</p>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-10 border-t-4 border-orange-600">
        <h2 className="text-xl font-semibold mb-4 text-orange-800">Add New Restaurant</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input type="text" placeholder="Restaurant Name" className="border p-2 rounded" />
          <select className="border p-2 rounded">
            <option>Select Region</option>
            <option>Houston Area</option>
            <option>Dallas/Fort Worth</option>
            <option>Austin Area</option>
            <option>San Antonio Area</option>
            <option>West Texas / Other</option>
          </select>
          <input type="text" placeholder="Cuisine (e.g. Nigerian, Ethiopian)" className="border p-2 rounded" />
          <button className="bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700 transition">
            Save to Directory
          </button>
        </form>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border">
        <h2 className="text-lg font-semibold mb-2">Current Count: 175</h2>
        <p className="text-sm text-gray-500 italic">To edit existing data, update the data.json file directly in GitHub.</p>
      </div>
    </div>
  );
}