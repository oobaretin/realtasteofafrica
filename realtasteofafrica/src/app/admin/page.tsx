// src/app/admin/page.tsx
export const dynamic = 'force-dynamic';

import React from 'react';
import { Resend } from 'resend';
import { useFormStatus } from 'react-dom'; // This is the secret for the button feel

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Created a specialized "Submit Button" component for better feel
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
      {pending ? '🚀 SENDING TO GMAIL...' : 'SAVE TO DIRECTORY & NOTIFY GMAIL'}
    </button>
  );
}

export default async function AdminPage(props: {
  searchParams: Promise<{ key?: string }>;
}) {
  const searchParams = await props.searchParams;
  const key = searchParams.key;
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

  if (!key || key !== ADMIN_KEY) {
    return <div className="p-20 text-center font-bold">Unauthorized</div>;
  }

  async function addListing(formData: FormData) {
    'use server';
    const name = formData.get('restaurantName');
    const city = formData.get('city');

    try {
      await resend.emails.send({
        from: 'Admin Dashboard <onboarding@resend.dev>',
        to: 'realtasteofafrica@gmail.com',
        subject: `New Listing: ${name}`,
        text: `New restaurant details:\n\nName: ${name}\nCity: ${city}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-orange-600 p-8 rounded-t-3xl text-white shadow-xl">
        <h1 className="text-4xl font-black italic">The Real Taste of Africa</h1>
        <p className="font-bold opacity-90 uppercase tracking-widest text-sm text-orange-100">Statewide Directory Manager</p>
      </div>
      
      <div className="bg-white p-10 rounded-b-3xl shadow-2xl border-x border-b border-gray-100">
        <div className="flex justify-between items-center mb-10 pb-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">175 Listings Active</h2>
          <span className="text-green-600 font-bold bg-green-50 px-4 py-1 rounded-full text-xs border border-green-200 uppercase tracking-widest">
            Authenticated
          </span>
        </div>

        {/* The form calls the server action */}
        <form action={addListing} className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="font-bold text-gray-600 mb-6 uppercase text-sm tracking-wider italic">Add 176th Restaurant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Restaurant Name</label>
                <input name="restaurantName" type="text" placeholder="e.g. Suya Joe's" required className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">City / Region</label>
                <input name="city" type="text" placeholder="e.g. Houston" required className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all" />
              </div>
              
              {/* Using our new interactive button here */}
              <SubmitButton />

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}