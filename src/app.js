import i18next from 'i18next';

import renderUI from './renders/renderUI';
import addUIHandlers from './handlers/addUIHandlers';
import mainWatcher from './watchers/mainWatcher';
import resources from './locales';
import { FormProcessState } from './const';

const DEFAULT_LANGUAGE = 'ru';

export default function app() {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: Object.keys(resources),
    resources,
  });

  const state = {
    language: DEFAULT_LANGUAGE,
    dataFeeds: [],
    currentFeed: '',
    message: '',
    rssForm: {
      url: '',
      isValid: '',
      processState: FormProcessState.FILLING,
    },
  };

  const containers = {
    title: document.querySelector('#title'),
    subTitle: document.querySelector('#subTitle'),
    languageSelect: document.querySelector('#languageSelect'),
    rssForm: document.querySelector('#rss'),
    formInput: document.querySelector('#rss input'),
    formLabel: document.querySelector('#rss label'),
    submitButton: document.querySelector('#rss button'),
    exampleMessage: document.querySelector('#example'),
    feedbackMessage: document.querySelector('#feedback'),
    feedsContainer: document.querySelector('#feeds'),
    postsContainer: document.querySelector('#posts'),
    modalContainer: document.querySelector('#modal'),
  };

  const watchedState = mainWatcher(state, i18nextInstance, containers);

  renderUI(containers, i18nextInstance, watchedState);
  addUIHandlers(containers, i18nextInstance, watchedState);
}
