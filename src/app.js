import i18next from 'i18next';
import onChange from 'on-change';
import render from './render';
import resources from './locales';

const DEFAULT_LANGUAGE = 'en';

export default async function app() {
  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: Object.keys(resources),
    resources,
  });

  const state = {
    language: DEFAULT_LANGUAGE,
  };

  const containers = {
    title: document.querySelector('#title'),
    subTitle: document.querySelector('#subTitle'),
    languageSelect: document.querySelector('#languageSelect'),
    formRss: document.querySelector('#rss'),
    formInput: document.querySelector('#rss input'),
    formLabel: document.querySelector('#rss label'),
    submitButton: document.querySelector('#rss button'),
    exampleMessage: document.querySelector('#example'),
    feedbackMessage: document.querySelector('#feedback'),
    feedsContainer: document.querySelector('#feeds'),
    postsContainer: document.querySelector('#posts'),
  };

  const watchedState = onChange(state, (key, value) => {
    switch (key) {
      case 'language':
        i18nInstance
          .changeLanguage(value)
          .then(() => render(containers, watchedState, i18nInstance));
        break;
      default:
        break;
    }
  });

  render(containers, watchedState, i18nInstance);
}
