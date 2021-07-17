import onChange from 'on-change';
import { feedback } from '../constants';
import renderContent from '../renders/renderContent';
import renderFeeds from '../renders/renderFeeds';
import renderMessage from '../renders/renderMessage';
import renderPosts from '../renders/renderPosts';
import renderUI from '../renders/renderUI';
import processWatcher from './processWatcher';

const isFetchSuccess = (watchedState) => watchedState.feedback === feedback.SUCCESS_FETCH;
const isError = (watchedState) => watchedState.rssForm.error;

export default function mainWatcher(state, i18nextInstance, containers) {
  const watchedState = onChange(state, (key, value) => {
    switch (key) {
      case 'ui.language':
        i18nextInstance.changeLanguage(value).then(() => {
          renderUI(containers, i18nextInstance, watchedState);
          renderContent(containers, i18nextInstance, watchedState);
        });
        break;

      case 'ui.watchedPosts':
        renderPosts(containers.postsContainer, i18nextInstance, watchedState);
        break;

      case 'feeds':
        renderFeeds(containers.feedsContainer, i18nextInstance, watchedState);
        break;

      case 'posts':
        renderPosts(containers.postsContainer, i18nextInstance, watchedState);
        break;

      case 'feedback':
        if (isFetchSuccess(watchedState)) {
          containers.formInput.value = '';
        }

        renderMessage(isError(watchedState))(
          containers.feedbackMessage,
          i18nextInstance,
          watchedState,
        );
        break;

      case 'rssForm.url':
        break;

      case 'rssForm.error':
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
