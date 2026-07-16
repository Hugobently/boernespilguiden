'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

interface StoredConsent {
  level?: 'necessary' | 'analytics' | 'all';
  analytics?: boolean;
}

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem('cookie_consent');
    if (!raw) return false;
    const data = JSON.parse(raw) as StoredConsent;
    return data.analytics === true || data.level === 'analytics' || data.level === 'all';
  } catch {
    return false;
  }
}

/**
 * Loads Google Analytics 4 - but ONLY when NEXT_PUBLIC_GA_ID is configured
 * AND the visitor has accepted statistics cookies in the consent banner.
 * Reacts to the banner's `cookieConsentChanged` event, so accepting cookies
 * starts tracking without a reload.
 */
export function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasAnalyticsConsent());

    const onConsentChange = () => setConsented(hasAnalyticsConsent());
    window.addEventListener('cookieConsentChanged', onConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', onConsentChange);
  }, []);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
