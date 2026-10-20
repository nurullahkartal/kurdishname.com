import { getRequestConfig } from 'next-intl/server';
import {
  supportedLanguages,
  defaultLocale,
  isValidLocale,
  routeTranslations,
  themeSlugs,
  type LangKey,
} from './lib/routes-config';

export { supportedLanguages, defaultLocale, isValidLocale, routeTranslations, themeSlugs, type LangKey };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: LangKey = requested && isValidLocale(requested) ? requested : defaultLocale;

  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
