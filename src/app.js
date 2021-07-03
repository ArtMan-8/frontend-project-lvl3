import i18next from 'i18next';

import renderUI from './renders/renderUI';
import addUIHandlers from './handlers/addUIHandlers';
import mainWatcher from './watchers/mainWatcher';
import resources from './locales';
import { FormProcessState } from './const';
import updaterFeeds from './handlers/updaterFeeds';

const DEFAULT_LANGUAGE = 'ru';
const DELAY_UPDATE = 5000;

export default function app() {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: Object.keys(resources),
    resources,
  });

  const state = {
    language: DEFAULT_LANGUAGE,
    updateDelay: DELAY_UPDATE,
    feeds: [],
    posts: new Map(),
    watchedPosts: new Set(),
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

  let updateTimer = setTimeout(function updatePosts() {
    updaterFeeds(watchedState)
      .then(() => {
        watchedState.updateDelay = DELAY_UPDATE;
        updateTimer = setTimeout(updatePosts, watchedState.updateDelay);
      })
      .catch(() => {
        watchedState.updateDelay *= 2;
        updateTimer = setTimeout(updatePosts, watchedState.updateDelay);
      });
  }, watchedState.updateDelay);
}
