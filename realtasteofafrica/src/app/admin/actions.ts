// src/app/admin/actions.ts
'use server';

import { Resend } from 'resend';

// This runs ONLY on the server, keeping your key hidden from the public
const resend = new Resend(process.env.RESEND_API_KEY);

export async function addListing(formData: FormData) {
  const name = formData.get('restaurantName');
  const city = formData.get('city');

  try {
    // Send the email to your Gmail
    await resend.emails.send({
      from: 'Admin Dashboard <onboarding@resend.dev>',
      to: 'realtasteofafrica@gmail.com',
      subject: `New Listing: ${name}`,
      text: `A new restaurant has been submitted:\n\nName: ${name}\nCity: ${city}\n\nSent from the Real Taste of Africa Admin Portal.`,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Resend Error:", error);
    return { success: false };
  }
}