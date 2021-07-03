import onChange from 'on-change';
import renderContent from '../renders/renderContent';
import renderMessage from '../renders/renderMessage';
import renderPosts from '../renders/renderPosts';
import renderUI from '../renders/renderUI';
import processWatcher from './processWatcher';

export default function mainWatcher(state, i18nextInstance, containers) {
  const watchedState = onChange(state, (key, value) => {
    switch (key) {
      case 'language':
        i18nextInstance.changeLanguage(value).then(() => {
          renderUI(containers, i18nextInstance, watchedState);
          renderContent(containers, i18nextInstance, watchedState);
        });
        break;

      case 'feeds':
        break;

      case 'posts':
        break;

      case 'currentFeed':
        renderContent(containers, i18nextInstance, watchedState);
        break;

      case 'watchedPosts':
        renderPosts(containers.postsContainer, i18nextInstance, watchedState);
        break;

      case 'message':
        renderMessage(
          containers.feedbackMessage,
          i18nextInstance,
          watchedState,
        );
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
