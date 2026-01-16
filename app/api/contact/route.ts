import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_EMAIL = 'boernespilguiden@proton.me';

export async function POST(request: NextRequest) {
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ugyldig email-adresse' },
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

    const readableSubject = subjectMap[subject] || subject;
    const emailSubject = `[Børnespilguiden] ${readableSubject} fra ${name}`;

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
            <p><strong>Fra:</strong> ${name} (${email})</p>
            <p><strong>Emne:</strong> ${readableSubject}</p>
            <hr />
            <h3>Besked:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">
              Denne email blev sendt fra kontaktformularen på børnespilguiden.dk
            </p>
          `,
          text: `
Ny besked fra kontaktformularen

Fra: ${name} (${email})
Emne: ${readableSubject}

Besked:
${message}

---
Denne email blev sendt fra kontaktformularen på børnespilguiden.dk
          `.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API error:', errorData);
        throw new Error('Failed to send email via Resend');
      }

      console.log(`Contact form email sent successfully via Resend to ${CONTACT_EMAIL}`);
      return NextResponse.json({ success: true });
    }

    // Fallback: Log the message (for development or when email isn't configured)
    console.warn('='.repeat(60));
    console.warn('EMAIL SERVICE NOT CONFIGURED - Message logged only:');
    console.warn('='.repeat(60));
    console.warn(`From: ${name} <${email}>`);
    console.warn(`Subject: ${emailSubject}`);
    console.warn(`Message: ${message}`);
    console.warn('='.repeat(60));
    console.warn('To enable email sending, set RESEND_API_KEY in your environment variables.');
    console.warn('Get a free API key at https://resend.com');
    console.warn('='.repeat(60));

    // Still return success so users know their message was "received"
    // In production, you should configure proper email sending
    return NextResponse.json({
      success: true,
      warning: 'Email service not configured - message logged only'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Der opstod en fejl. Prøv igen senere.' },
      { status: 500 }
    );
  }
}
