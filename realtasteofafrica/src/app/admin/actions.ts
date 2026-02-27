// src/app/admin/actions.ts
'use server';

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const TO_EMAIL = 'therealtasteofafrica@gmail.com';
// Use RESEND_FROM or verify your domain at resend.com/domains and set e.g. noreply@yourdomain.com
const FROM_EMAIL = process.env.RESEND_FROM || 'Real Taste of Africa <onboarding@resend.dev>';

export async function addListing(formData: FormData) {
  const adminKey = formData.get('adminKey');
  const expectedKey = process.env.ADMIN_KEY;
  if (expectedKey && adminKey !== expectedKey) {
    return { success: false, error: 'Invalid admin key' };
  }

  const name = formData.get('restaurantName');
  const city = formData.get('city');

  if (!RESEND_API_KEY) {
    return {
      success: false,
      error: 'RESEND_API_KEY not set. Add it in Vercel: Settings → Environment Variables.',
    };
  }

  try {
    const { data, error } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Listing: ${name}`,
      text: `A new restaurant has been submitted:\n\nName: ${name}\nCity: ${city}\n\nSent from the Real Taste of Africa Admin Portal.`,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Resend rejected the email. Verify your domain at resend.com/domains.',
      };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Resend Error:', err);
    return {
      success: false,
      error: message,
    };
  }
}