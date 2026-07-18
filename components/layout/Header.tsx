'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/lib/hooks';
import { FoxFace } from '@/components/brand/FoxMascot';
import { Icon, type IconName } from '@/components/ui/Icon';

// ============================================================================
// TYPES
// ============================================================================

interface SearchSuggestion {
  type: 'game' | 'boardgame' | 'media' | 'category' | 'age';
  title: string;
  slug: string;
  icon: IconName;
}

// ============================================================================
// SEARCH INPUT COMPONENT
// ============================================================================

function SearchInput({ className, onClose }: { className?: string; onClose?: () => void }) {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quick suggestions when empty - memoized to prevent infinite loops
  const quickSuggestions: SearchSuggestion[] = useMemo(() => [
    { type: 'age', title: t('ageGroups.0-3'), slug: '0-3', icon: 'blocks' },
    { type: 'age', title: t('ageGroups.3-6'), slug: '3-6', icon: 'kite' },
    { type: 'age', title: t('ageGroups.7+'), slug: '7+', icon: 'rocket' },
    { type: 'category', title: t('categories.learning'), slug: 'laering', icon: 'book' },
    { type: 'category', title: t('games.noAds'), slug: 'ingen-reklamer', icon: 'shield' },
  ], [t]);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string, defaultSuggestions: SearchSuggestion[]) => {
    if (searchQuery.length < 2) {
      setSuggestions(defaultSuggestions);
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`);
      const data = await res.json();

      if (data.success) {
        const results: SearchSuggestion[] = [];

        // Add digital games
        data.data.digital?.slice(0, 2).forEach((game: { title: string; slug: string }) => {
          results.push({
            type: 'game',
            title: game.title,
            slug: game.slug,
            icon: 'gamepad',
          });
        });

        // Add board games
        data.data.board?.slice(0, 2).forEach((game: { title: string; slug: string }) => {
          results.push({
            type: 'boardgame',
            title: game.title,
            slug: game.slug,
            icon: 'dice',
          });
        });

        // Add Film & Serier
        data.data.media?.slice(0, 2).forEach((item: { title: string; slug: string }) => {
          results.push({
            type: 'media',
            title: item.title,
            slug: item.slug,
            icon: 'tv',
          });
        });

        setSuggestions(results.length > 0 ? results : defaultSuggestions);
      }
    } catch {
      setSuggestions(defaultSuggestions);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query, quickSuggestions);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions, quickSuggestions]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (query) {
        router.push(`/soeg?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        onClose?.();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'game':
        router.push(`/spil/${suggestion.slug}`);
        break;
      case 'boardgame':
        router.push(`/braetspil/${suggestion.slug}`);
        break;
      case 'media':
        router.push(`/film-serier/${suggestion.slug}`);
        break;
      case 'age':
        router.push(`/spil?alder=${suggestion.slug}`);
        break;
      case 'category':
        router.push(`/soeg?q=${encodeURIComponent(suggestion.title)}`);
        break;
    }
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('common.searchPlaceholder')}
          className={cn(
            'w-full pl-12 pr-4 py-3 rounded-2xl',
            'bg-[#FFFCF7] border-2 border-transparent',
            'text-[#4A4A4A] placeholder:text-[#6B7280]',
            'shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[#FFB5A7] focus:shadow-[0_0_0_4px_rgba(255,181,167,0.2)]'
          )}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Ryd søgefelt"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#4A4A4A]/10 transition-colors"
          >
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFCF7] rounded-2xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] border border-[#FFB5A7]/20 overflow-hidden z-50">
          <div className="p-2">
            {!query && (
              <p className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                {t('search.quickSearch')}
              </p>
            )}
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.slug}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-left transition-colors',
                  selectedIndex === index
                    ? 'bg-[#FFB5A7]/20 text-[#4A4A4A]'
                    : 'hover:bg-[#FFB5A7]/10 text-[#4A4A4A]'
                )}
              >
                <Icon name={suggestion.icon} className="w-5 h-5 text-[#C2410C]" />
                <span className="font-medium">{suggestion.title}</span>
                <span className="ml-auto text-xs text-[#6B7280]">
                  {suggestion.type === 'game' && t('search.gamesCategory')}
                  {suggestion.type === 'boardgame' && t('search.boardGamesCategory')}
                  {suggestion.type === 'age' && t('search.ageCategory')}
                  {suggestion.type === 'category' && t('search.categoryCategory')}
                </span>
              </button>
            ))}
          </div>

          {query && (
            <div className="border-t border-[#FFB5A7]/10 p-2">
              <button
                type="button"
                onClick={() => {
                  router.push(`/soeg?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                  onClose?.();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFB5A7]/10 transition-colors"
              >
                <svg className="w-5 h-5 text-[#FFB5A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium text-[#4A4A4A]">
                  {t('search.searchFor')} &quot;{query}&quot;
                </span>
                <span className="ml-auto text-xs text-[#6B7280]">Enter ↵</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LOGO COMPONENT
// ============================================================================

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Ræven - Børnespilguidens maskot */}
      <div className="w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
        <FoxFace className="w-9 h-9" />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-display font-bold text-lg leading-tight text-[#2E2822] group-hover:text-[#C2410C] transition-colors">
          Børnespilguiden
        </span>
        <span className="text-xs text-[#6B7280] hidden sm:block">
          De bedste spil til børn
        </span>
      </div>
    </Link>
  );
}

// ============================================================================
// MOBILE MENU COMPONENT
// ============================================================================

function MobileMenu({
  isOpen,
  onClose,
  navLinks,
}: {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ href: string; label: string; icon: IconName }>;
}) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render on server or when closed
  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] md:hidden">
      {/* Backdrop - covers entire screen */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel - slides in from right */}
      <div
        ref={focusTrapRef}
        className="absolute top-0 right-0 h-full w-[85vw] max-w-[320px] bg-[#FFF9F0] shadow-[-8px_0_32px_-4px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label={t('common.menu')}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#FFB5A7]/20">
            <span className="font-bold text-[#4A4A4A]">{t('common.menu')}</span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#FFB5A7]/10 transition-colors"
              aria-label={t('common.closeMenu')}
            >
              <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-[#FFB5A7]/20">
            <SearchInput onClose={onClose} />
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl',
                      'font-semibold text-[#4A443C]',
                      'hover:bg-[#FFB5A7]/10 hover:text-[#C2410C]',
                      'transition-all duration-200'
                    )}
                  >
                    <Icon name={link.icon} className="w-5 h-5 text-[#C2410C]" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Age categories quick links */}
          <div className="p-4 border-t border-[#FFB5A7]/20">
            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">
              {t('home.chooseAge')}
            </p>
            <div className="flex flex-wrap gap-2">
              {([
                { label: '0-3', color: 'bg-[#FFD1DC] text-[#8B3A56]', icon: 'blocks' as IconName },
                { label: '3-6', color: 'bg-[#BAFFC9] text-[#1E5C40]', icon: 'kite' as IconName },
                { label: '7+', color: 'bg-[#BAE1FF] text-[#1D4E89]', icon: 'rocket' as IconName },
              ]).map((age) => (
                <Link
                  key={age.label}
                  href={`/spil?alder=${age.label}`}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                    'text-sm font-semibold',
                    age.color,
                    'hover:scale-105 transition-transform'
                  )}
                >
                  <Icon name={age.icon} className="w-4 h-4" />
                  <span>{age.label} {t('common.years')}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations();

  const navLinks: Array<{ href: string; label: string; icon: IconName }> = [
    { href: '/spil', label: t('nav.games'), icon: 'gamepad' },
    { href: '/braetspil', label: t('nav.boardGames'), icon: 'dice' },
    { href: '/film-serier', label: t('nav.filmSeries'), icon: 'tv' },
    { href: '/om', label: t('nav.about'), icon: 'smile' },
  ];

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-semibold"
      >
        {t('common.skipToContent')}
      </a>
      <header className="sticky top-0 z-40 bg-[#FFF9F0]/90 backdrop-blur-lg border-b border-[#FFB5A7]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchInput />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl',
                  'font-semibold text-[#4A443C]',
                  'hover:bg-[#FFB5A7]/10 hover:text-[#C2410C]',
                  'transition-all duration-200'
                )}
              >
                <Icon name={link.icon} className="w-[18px] h-[18px] text-[#C2410C]" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-[#FFB5A7]/10 transition-colors"
            aria-label={t('common.menu')}
          >
            <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
      />
    </header>
    </>
  );
}
