import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationProps {
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export function Navigation({ breadcrumbs, className }: NavigationProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      <Link
        href="/"
        className="text-slate hover:text-candy-pink transition-colors"
      >
        🏠
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-slate/40">/</span>
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate hover:text-candy-pink transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
