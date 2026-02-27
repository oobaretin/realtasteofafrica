'use client';

import React, { use } from 'react';
import { useFormStatus } from 'react-dom';
import { addListing } from './actions';
import { RESTAURANTS } from '@/lib/restaurants';

// THE INTERACTIVE BUTTON
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className={`md:col-span-2 text-white font-black py-5 rounded-2xl transition-all transform active:scale-95 shadow-lg ${
        pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-orange-600'
      }`}
    >
      {pending ? 'Sending...' : 'Notify via Gmail'}
    </button>
  );
}

export default function AdminPage(props: {
  searchParams: Promise<{ key?: string }>;
}) {
  // Unwrap the async searchParams using the 'use' hook
  const searchParams = use(props.searchParams);
  const key = searchParams.key;

  if (!key) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-10 bg-white shadow-2xl rounded-3xl text-center border-t-8 border-orange-600">
          <h1 className="text-3xl font-black text-gray-800">Texas Admin Restricted</h1>
          <p className="mt-4 text-gray-600 font-medium">Visit /admin?key=your-secret to access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-orange-600 p-8 rounded-t-3xl text-white shadow-xl">
        <h1 className="text-4xl font-black italic">The Real Taste of Africa</h1>
        <p className="font-bold opacity-90 uppercase tracking-widest text-sm">Statewide Directory Manager</p>
      </div>
      
      <div className="bg-white p-10 rounded-b-3xl shadow-2xl border-x border-b border-gray-100">
        <div className="flex justify-between items-center mb-10 pb-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{RESTAURANTS.length} Listings Active</h2>
          <span className="text-green-600 font-bold bg-green-50 px-4 py-1 rounded-full text-xs border border-green-200 uppercase tracking-widest">
            Authenticated
          </span>
        </div>

        <form 
          action={async (formData) => {
            formData.set('adminKey', key || '');
            const result = await addListing(formData);
            if (result?.success) {
              alert("Success! Notification sent to Gmail.");
            } else {
              alert("Failed: " + (result?.error || "Unknown error"));
            }
          }} 
          className="space-y-6"
        >
          <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="font-bold text-gray-600 mb-6 uppercase text-sm tracking-wider italic">Add Restaurant #{RESTAURANTS.length + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Restaurant Name</label>
                <input name="restaurantName" type="text" placeholder="e.g. Suya Joe's" required className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">City / Region</label>
                <input name="city" type="text" placeholder="e.g. Houston" required className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all" />
              </div>
              
              <SubmitButton />

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}