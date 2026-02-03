// app/admin/page.tsx
export const dynamic = 'force-dynamic'; // This is the magic line for Vercel

import React from 'react';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  // In Next.js 15, searchParams is a Promise, so we must 'await' it
  const resolvedParams = await searchParams; 
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

  if (!resolvedParams.key || resolvedParams.key !== ADMIN_KEY) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-xl rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Restricted Access</h1>
          <p className="mt-2 text-gray-600">The Real Taste of Africa Admin Portal is private.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="border-b pb-4 mb-8">
        <h1 className="text-3xl font-extrabold text-orange-700">Texas Directory Admin</h1>
        <p className="text-gray-500">Managing 175+ Verified African Restaurants</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
        <h2 className="text-xl font-bold mb-4">Add New Restaurant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-3 rounded-lg" placeholder="Restaurant Name" />
          <select className="border p-3 rounded-lg">
            <option>Houston Area</option>
            <option>Dallas / Fort Worth</option>
            <option>Austin Area</option>
            <option>San Antonio Area</option>
          </select>
          <button className="md:col-span-2 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">
            Submit New Listing
          </button>
        </div>
      </section>
    </div>
  );
}