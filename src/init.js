import i18next from 'i18next';
import resources from './locales';
import { DEFAULT_LANGUAGE } from './constants';

export default function init() {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance
    .init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: Object.keys(resources),
      resources,
    })
    .then(() => i18nextInstance);
}
