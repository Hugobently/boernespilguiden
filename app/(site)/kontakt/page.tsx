'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Der opstod en fejl');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Der opstod en fejl. Prøv igen senere.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#A2D2FF] to-[#8ECAE6] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-6xl mb-4 block">✉️</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-white/90">
            {t('pageSubtitle')}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-[#4A4A4A] mb-6">
              {t('writeToUs')}
            </h2>
            <p className="text-[#7A7A7A] mb-8">
              {t('writeToUsText')}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#BAFFC9] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">{t('emailTitle')}</h3>
                  <a href="mailto:boernespilguiden@proton.me" className="text-[#1D4E89] hover:underline">boernespilguiden@proton.me</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#BAE1FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">{t('responseTimeTitle')}</h3>
                  <p className="text-[#7A7A7A]">{t('responseTimeText')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD1DC] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A]">{t('tipTitle')}</h3>
                  <p className="text-[#7A7A7A]">
                    {t('tipText')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
            {status === 'success' ? (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-xl font-bold text-[#4A4A4A] mb-2">
                  Tak for din besked!
                </h3>
                <p className="text-[#7A7A7A]">
                  Vi vender tilbage hurtigst muligt.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 rounded-xl bg-[#BAFFC9] text-[#2D6A4F] font-semibold hover:bg-[#95D5B2] transition-colors"
                >
                  Send en ny besked
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                    <p className="flex items-center gap-2">
                      <span>⚠️</span>
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    {t('nameLabel')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB5A7] focus:ring-2 focus:ring-[#FFB5A7]/20 outline-none transition-all"
                    placeholder={t('namePlaceholder')}
                    disabled={status === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB5A7] focus:ring-2 focus:ring-[#FFB5A7]/20 outline-none transition-all"
                    placeholder={t('emailPlaceholder')}
                    disabled={status === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    {t('subjectLabel')}
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB5A7] focus:ring-2 focus:ring-[#FFB5A7]/20 outline-none transition-all"
                    disabled={status === 'loading'}
                  >
                    <option value="">{t('subjectPlaceholder')}</option>
                    <option value="forslag">{t('subjectSuggestion')}</option>
                    <option value="feedback">{t('subjectFeedback')}</option>
                    <option value="fejl">{t('subjectBug')}</option>
                    <option value="samarbejde">{t('subjectCollaboration')}</option>
                    <option value="andet">{t('subjectOther')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    {t('messageLabel')}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:border-[#FFB5A7] focus:ring-2 focus:ring-[#FFB5A7]/20 outline-none transition-all resize-none"
                    placeholder={t('messagePlaceholder')}
                    disabled={status === 'loading'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl bg-[#FFB5A7] text-white font-semibold hover:bg-[#F8A99B] transition-colors shadow-[0_4px_0_0_#E8958A] hover:shadow-[0_2px_0_0_#E8958A] hover:translate-y-0.5 active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_0_#E8958A]"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sender...
                    </span>
                  ) : (
                    t('submitButton')
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
