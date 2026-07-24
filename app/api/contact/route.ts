import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/middleware/rate-limit';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_EMAIL = 'boernespislguiden@proton.me';

// Contact form: 5 submissions per 10 minutes per IP (spam protection)
const contactRateLimit = { windowMs: 10 * 60 * 1000, maxRequests: 5 };

const MAX_LENGTHS = { name: 100, email: 200, subject: 100, message: 5000 } as const;

// User input is interpolated into an HTML email body — escape it so a
// malicious message can't inject markup into the mail client
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST = withRateLimit(contactRateLimit, async (request: NextRequest) => {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle felter skal udfyldes' },
        { status: 400 }
      );
    }

    // Validate lengths
    if (
      name.length > MAX_LENGTHS.name ||
      email.length > MAX_LENGTHS.email ||
      subject.length > MAX_LENGTHS.subject ||
      message.length > MAX_LENGTHS.message
    ) {
      return NextResponse.json(
        { error: 'Et eller flere felter er for lange' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ugyldig e-mailadresse' },
        { status: 400 }
      );
    }

    // Subject mapping for readability
    const subjectMap: Record<string, string> = {
      forslag: 'Forslag til spil',
      feedback: 'Feedback',
      fejl: 'Fejlrapport',
      samarbejde: 'Samarbejde',
      andet: 'Andet',
    };

    const readableSubject = subjectMap[subject] || 'Andet';
    const emailSubject = `[Børnespilguiden] ${readableSubject} fra ${name.replace(/[\r\n]/g, ' ')}`;

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    // Check if Resend is configured (recommended for Vercel)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Børnespilguiden <onboarding@resend.dev>',
          to: [CONTACT_EMAIL],
          reply_to: email,
          subject: emailSubject,
          html: `
            <h2>Ny besked fra kontaktformularen</h2>
            <p><strong>Fra:</strong> ${safeName} (${safeEmail})</p>
            <p><strong>Emne:</strong> ${readableSubject}</p>
            <hr />
            <h3>Besked:</h3>
            <p style="white-space: pre-wrap;">${safeMessage}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">
              Denne e-mail blev sendt fra kontaktformularen på børnespilguiden.dk
            </p>
          `,
          text: `
Ny besked fra kontaktformularen

Fra: ${name} (${email})
Emne: ${readableSubject}

Besked:
${message}

---
Denne e-mail blev sendt fra kontaktformularen på børnespilguiden.dk
          `.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API error:', errorData);
        throw new Error('Failed to send email via Resend');
      }

      return NextResponse.json({ success: true });
    }

    // Fallback when email isn't configured - still return success
    return NextResponse.json({
      success: true,
      warning: 'Email service not configured'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Der opstod en fejl. Prøv igen senere.' },
      { status: 500 }
    );
  }
});
