import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

// The site is Danish-only. The locale is fixed so no request data (cookies)
// is read here — that would force every page into dynamic rendering.
export default getRequestConfig(async () => ({
  locale: defaultLocale,
  messages: (await import(`../messages/${defaultLocale}.json`)).default,
}));
