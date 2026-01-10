'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, totalItems, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();

  // Build URL with existing params + page
  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${baseUrl}?${params.toString()}`;
  }

  // Generate page numbers to show (max 5 at a time)
  function getPageNumbers() {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Info text */}
      <p className="text-sm text-gray-600">
        Viser side {currentPage} af {totalPages} ({totalItems} resultater i alt)
      </p>

      {/* Navigation */}
      <nav className="flex items-center gap-2">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            ← Forrige
          </Link>
        ) : (
          <span className="px-3 py-2 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
            ← Forrige
          </span>
        )}

        {/* Page 1 + ... if far from start */}
        {currentPage > 3 && (
          <>
            <Link
              href={getPageUrl(1)}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              1
            </Link>
            {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {/* Page numbers */}
        {getPageNumbers().map(page => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {page}
          </Link>
        ))}

        {/* ... + last page if far from end */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
            <Link
              href={getPageUrl(totalPages)}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Næste →
          </Link>
        ) : (
          <span className="px-3 py-2 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
            Næste →
          </span>
        )}
      </nav>
    </div>
  );
}
