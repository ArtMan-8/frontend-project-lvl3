import onChange from 'on-change';
import fetchRSS from '../handlers/fetchRSS';
import renderContent from '../renders/renderContent';
import renderMessage from '../renders/renderMessage';
import renderUI from '../renders/renderUI';
import processWatcher from './processWatcher';
import urlWatcher from './urlWatcher';

export default function mainWatcher(state, i18nextInstance, containers) {
  const watchedState = onChange(state, (key, value) => {
    switch (key) {
      case 'language':
        i18nextInstance.changeLanguage(value).then(() => {
          renderUI(containers, i18nextInstance, watchedState);
          renderMessage(containers, i18nextInstance, watchedState);
          renderContent(containers, i18nextInstance, state);
        });
        break;

      case 'dataFeeds':
        renderContent(containers, i18nextInstance, state);
        break;

      case 'message':
        renderMessage(containers, i18nextInstance, watchedState);
        break;

      case 'rssForm.url':
        urlWatcher(watchedState, value);
        break;

      case 'rssForm.isValid':
        fetchRSS(watchedState, watchedState.rssForm.url);
        break;

      case 'rssForm.processState':
        processWatcher(containers, watchedState);
        break;

      default:
        throw new Error(`Unknown state: ${watchedState}`);
    }
  });

  return watchedState;
}
