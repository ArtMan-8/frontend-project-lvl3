import renderUI from './renders/renderUI';
import addUIHandlers from './handlers/addUIHandlers';
import mainWatcher from './watchers/mainWatcher';
import postsRefetch from './handlers/updaterFeeds';
import { DEFAULT_LANGUAGE, formProcessState } from './constants';
import init from './init';

export default function app() {
  init().then((i18nextInstance) => {
    const state = {
      ui: {
        watchedPosts: new Set(),
        language: DEFAULT_LANGUAGE,
      },
      feeds: [],
      posts: [],
      feedback: '',
      rssForm: {
        url: '',
        isValid: true,
        error: false,
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

    const watchedState = mainWatcher(state, i18nextInstance, containers);

    renderUI(containers, i18nextInstance, watchedState);
    addUIHandlers(containers, i18nextInstance, watchedState);
    postsRefetch(watchedState);
  });
}
