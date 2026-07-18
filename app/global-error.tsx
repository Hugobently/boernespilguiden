'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="da">
      <body>
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#FFFDF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: '4rem', height: '4rem', margin: '0 auto 1.5rem', display: 'block' }} aria-hidden="true">
              <path d="M12 3.5L22 20H2L12 3.5z" />
              <path d="M12 10v4.5M12 17.2h.01" />
            </svg>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#4A4A4A', marginBottom: '1rem' }}>
              Ups! Noget gik galt
            </h1>
            <p style={{ color: '#7A7A7A', marginBottom: '2rem' }}>
              Der opstod en kritisk fejl. Prøv at genindlæse siden.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#98DDCA',
                color: 'white',
                fontWeight: '600',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Prøv igen
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
