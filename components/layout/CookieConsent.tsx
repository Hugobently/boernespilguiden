'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ConsentLevel = 'necessary' | 'analytics' | 'all';

interface CookieConsentProps {
  translations?: {
    title?: string;
    description?: string;
    acceptAll?: string;
    acceptNecessary?: string;
    customize?: string;
    save?: string;
    necessary?: string;
    necessaryDesc?: string;
    analytics?: string;
    analyticsDesc?: string;
    preferences?: string;
    preferencesDesc?: string;
    learnMore?: string;
  };
}

const defaultTranslations = {
  title: 'Vi bruger cookies',
  description: 'Vi bruger cookies for at give dig den bedste oplevelse på vores side. Nødvendige cookies sikrer at siden fungerer, mens statistik-cookies hjælper os med at forbedre den.',
  acceptAll: 'Accepter alle',
  acceptNecessary: 'Kun nødvendige',
  customize: 'Tilpas',
  save: 'Gem valg',
  necessary: 'Nødvendige',
  necessaryDesc: 'Disse cookies er nødvendige for at siden fungerer og kan ikke slås fra.',
  analytics: 'Statistik',
  analyticsDesc: 'Hjælper os med at forstå hvordan besøgende bruger siden.',
  preferences: 'Præferencer',
  preferencesDesc: 'Husker dine valg og præferencer.',
  learnMore: 'Læs mere',
};

export function CookieConsent({ translations = {} }: CookieConsentProps) {
  const t = { ...defaultTranslations, ...translations };
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [preferencesEnabled, setPreferencesEnabled] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (level: ConsentLevel) => {
    const consentData = {
      level,
      necessary: true,
      analytics: level === 'analytics' || level === 'all',
      preferences: level === 'all',
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('cookie_consent', JSON.stringify(consentData));
    document.cookie = `cookie_consent=${level}; max-age=31536000; path=/; SameSite=Lax`;

    // Dispatch event for analytics scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consentData }));

    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    saveConsent('all');
  };

  const handleAcceptNecessary = () => {
    saveConsent('necessary');
  };

  const handleSaveCustom = () => {
    if (analyticsEnabled && preferencesEnabled) {
      saveConsent('all');
    } else if (analyticsEnabled) {
      saveConsent('analytics');
    } else {
      saveConsent('necessary');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto transition-opacity duration-300"
        onClick={() => {}} // Prevent clicks from passing through
      />

      {/* Banner */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Main Content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-4xl flex-shrink-0">🍪</span>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-[#4A4A4A] mb-1 sm:mb-2">
                    {t.title}
                  </h2>
                  <p className="text-[#7A7A7A] text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {t.description}{' '}
                    <Link
                      href="/cookiepolitik"
                      className="text-[#FFB5A7] hover:underline"
                    >
                      {t.learnMore}
                    </Link>
                  </p>

                  {/* Customize Section */}
                  {showCustomize && (
                    <div className="mb-4 space-y-3 p-4 bg-[#FFFCF7] rounded-xl">
                      {/* Necessary - Always on */}
                      <label className="flex items-start gap-3 cursor-not-allowed opacity-80">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="mt-1 w-4 h-4 rounded border-[#E0E0E0]"
                        />
                        <div>
                          <span className="font-medium text-[#4A4A4A] text-sm">{t.necessary}</span>
                          <span className="ml-2 text-xs text-[#98DDCA] font-medium">(Altid aktiv)</span>
                          <p className="text-xs text-[#7A7A7A]">{t.necessaryDesc}</p>
                        </div>
                      </label>

                      {/* Analytics */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={analyticsEnabled}
                          onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-[#E0E0E0] text-[#98DDCA] focus:ring-[#98DDCA]"
                        />
                        <div>
                          <span className="font-medium text-[#4A4A4A] text-sm">{t.analytics}</span>
                          <p className="text-xs text-[#7A7A7A]">{t.analyticsDesc}</p>
                        </div>
                      </label>

                      {/* Preferences */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferencesEnabled}
                          onChange={(e) => setPreferencesEnabled(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-[#E0E0E0] text-[#98DDCA] focus:ring-[#98DDCA]"
                        />
                        <div>
                          <span className="font-medium text-[#4A4A4A] text-sm">{t.preferences}</span>
                          <p className="text-xs text-[#7A7A7A]">{t.preferencesDesc}</p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {showCustomize ? (
                      <>
                        <button
                          onClick={handleSaveCustom}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#98DDCA] text-white font-semibold rounded-full hover:bg-[#7FC7B3] transition-colors text-xs sm:text-sm"
                        >
                          {t.save}
                        </button>
                        <button
                          onClick={() => setShowCustomize(false)}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#F5F5F5] text-[#7A7A7A] font-semibold rounded-full hover:bg-[#E8E8E8] transition-colors text-xs sm:text-sm"
                        >
                          Tilbage
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleAcceptAll}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#98DDCA] text-white font-semibold rounded-full hover:bg-[#7FC7B3] transition-colors text-xs sm:text-sm"
                        >
                          {t.acceptAll}
                        </button>
                        <button
                          onClick={handleAcceptNecessary}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#F5F5F5] text-[#7A7A7A] font-semibold rounded-full hover:bg-[#E8E8E8] transition-colors text-xs sm:text-sm"
                        >
                          {t.acceptNecessary}
                        </button>
                        <button
                          onClick={() => setShowCustomize(true)}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 text-[#7A7A7A] font-medium hover:text-[#4A4A4A] transition-colors text-xs sm:text-sm underline underline-offset-2"
                        >
                          {t.customize}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
