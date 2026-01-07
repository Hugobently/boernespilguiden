'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
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
                  <p className="text-[#7A7A7A]">boernespislguiden@proton.me</p>
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
            {submitted ? (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-xl font-bold text-[#4A4A4A] mb-2">
                  {t('successMessage').split('!')[0]}!
                </h3>
                <p className="text-[#7A7A7A]">
                  {t('successMessage').split('!')[1] || ''}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FFB5A7] text-white font-semibold hover:bg-[#F8A99B] transition-colors shadow-[0_4px_0_0_#E8958A] hover:shadow-[0_2px_0_0_#E8958A] hover:translate-y-0.5 active:shadow-none active:translate-y-1"
                >
                  {t('submitButton')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
