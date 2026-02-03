// src/app/admin/page.tsx
export const dynamic = 'force-dynamic';

import React from 'react';
import { Resend } from 'resend';

// We initialize Resend with the key you'll add to Vercel later
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function AdminPage(props: {
  searchParams: Promise<{ key?: string }>;
}) {
  const searchParams = await props.searchParams;
  const key = searchParams.key;
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

  if (!key || key !== ADMIN_KEY) {
    return <div className="p-20 text-center font-bold">Unauthorized</div>;
  }

  // This function runs on the server when you click "Save"
  async function addListing(formData: FormData) {
    'use server';
    
    const name = formData.get('restaurantName');
    const city = formData.get('city');

    try {
      // This sends the email to YOU (the address in the contact)
      await resend.emails.send({
        from: 'Admin Dashboard <onboarding@resend.dev>',
        to: 'realtasteofafrica@gmail.com', // Your contact email
        subject: `New Listing: ${name}`,
        text: `New restaurant details captured:\n\nName: ${name}\nCity: ${city}\n\nProcessed by Texas Admin Portal.`,
      });
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Email failed:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-orange-600 p-8 rounded-t-3xl text-white shadow-lg">
        <h1 className="text-4xl font-black italic">The Real Taste of Africa</h1>
        <p className="font-bold opacity-90 uppercase tracking-widest text-sm">Statewide Directory Manager</p>
      </div>
      
      <div className="bg-white p-10 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
        <div className="flex justify-between items-center mb-10 pb-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">175 Listings Active</h2>
          <span className="text-green-600 font-bold bg-green-50 px-4 py-1 rounded-full text-xs border border-green-200 uppercase tracking-widest">
            Authenticated
          </span>
        </div>

        <form action={addListing} className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="font-bold text-gray-600 mb-6 uppercase text-sm tracking-wider">Add 176th Restaurant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Restaurant Name</label>
                <input 
                  name="restaurantName"
                  type="text" 
                  placeholder="e.g. Suya Joe's" 
                  required 
                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">City / Region</label>
                <input 
                  name="city"
                  type="text" 
                  placeholder="e.g. Houston" 
                  required 
                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all" 
                />
              </div>
              <button 
                type="submit"
                className="md:col-span-2 bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-orange-600 transition-all transform active:scale-95 shadow-lg"
              >
                SAVE TO DIRECTORY & NOTIFY GMAIL
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}