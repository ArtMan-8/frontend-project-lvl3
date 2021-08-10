import 'bootstrap/js/dist/modal';
import i18next from 'i18next';
import renderUI from './renders/renderUI';
import addUIHandlers from './handlers/addUIHandlers';
import mainWatcher from './watchers/mainWatcher';
import postsRefetch from './handlers/updaterFeeds';
import resources from './locales';
import { DEFAULT_LANGUAGE, formProcessState } from './constants';

function init() {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance
    .init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: Object.keys(resources),
      resources,
    })
    .then(() => {
      const state = {
        ui: {
          selectedPost: {},
          watchedPosts: new Set(),
          language: DEFAULT_LANGUAGE,
        },
        feeds: [],
        posts: [],
        rssForm: {
          url: '',
          isValid: true,
          error: null,
          processState: formProcessState.FILLING,
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

      return { state, i18nextInstance, containers };
    });
}

export default function app() {
  init().then(({ state, i18nextInstance, containers }) => {
    const watchedState = mainWatcher(state, i18nextInstance, containers);

    renderUI(containers, i18nextInstance, watchedState);
    addUIHandlers(containers, watchedState);
    postsRefetch(watchedState);
  });
}
