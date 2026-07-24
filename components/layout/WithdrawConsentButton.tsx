'use client';

/**
 * Lets the user withdraw their cookie consent from the cookie policy page.
 * Clears the stored consent and reloads, so the consent banner reappears.
 */
export function WithdrawConsentButton() {
  const handleWithdraw = () => {
    localStorage.removeItem('cookie_consent');
    document.cookie = 'cookie_consent=; max-age=0; path=/; SameSite=Lax';
    window.location.reload();
  };

  return (
    <button
      onClick={handleWithdraw}
      className="px-5 py-2.5 bg-[#C2410C] text-white font-semibold rounded-full hover:bg-[#A93409] transition-colors text-sm"
    >
      Træk samtykke tilbage
    </button>
  );
}

export default WithdrawConsentButton;
