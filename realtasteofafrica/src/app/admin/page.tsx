// src/app/admin/page.tsx
export const dynamic = 'force-dynamic';

import React from 'react';

// Notice the 'async' and the 'Promise' type - this is the Next 15 standard
export default async function AdminPage(props: {
  searchParams: Promise<{ key?: string }>;
}) {
  // STEP 1: Await the search parameters (Async fix)
  const searchParams = await props.searchParams;
  const key = searchParams.key;

  // STEP 2: Grab your secret from Vercel's environment
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

  // STEP 3: Security Check
  if (!key || key !== ADMIN_KEY) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-10 bg-white shadow-2xl rounded-3xl text-center border-t-8 border-orange-600">
          <h1 className="text-3xl font-black text-gray-800">Texas Admin Restricted</h1>
          <p className="mt-4 text-gray-600 font-medium">Please provide the valid administrator key.</p>
        </div>
      </div>
    );
  }

  // STEP 4: Success View
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-orange-600 p-8 rounded-t-3xl text-white">
        <h1 className="text-4xl font-black italic">The Real Taste of Africa</h1>
        <p className="font-bold opacity-90 uppercase tracking-widest">Statewide Directory Manager</p>
      </div>
      
      <div className="bg-white p-8 rounded-b-3xl shadow-lg border-x border-b border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold">175 Listings Active</h2>
          <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm border border-green-200">
            Authenticated
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4">Add 176th Restaurant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" className="p-3 rounded-lg border focus:ring-2 focus:ring-orange-500" />
              <input type="text" placeholder="City (Houston, Dallas, etc.)" className="p-3 rounded-lg border" />
              <button className="md:col-span-2 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition">
                SAVE NEW LISTING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}