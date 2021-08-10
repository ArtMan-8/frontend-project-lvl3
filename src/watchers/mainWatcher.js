import onChange from 'on-change';
import { formProcessState } from '../constants';
import renderFeeds from '../renders/renderFeeds';
import renderMessage from '../renders/renderMessage';
import renderPosts from '../renders/renderPosts';
import renderUI from '../renders/renderUI';
import renderContent from '../renders/renderContent';
import processWatcher from './processWatcher';
import renderModal from '../renders/renderModal';

const isFetchFinished = ({ rssForm }) => rssForm.processState === formProcessState.FINISHED;

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

      case 'ui.selectedPost':
        renderModal(containers.modalContainer, i18nextInstance, value);
        break;

      case 'feeds':
        renderFeeds(containers.feedsContainer, i18nextInstance, watchedState);
        break;

      case 'posts':
        renderPosts(containers.postsContainer, i18nextInstance, watchedState);
        containers.formInput.value = '';
        break;

      case 'rssForm.url':
        break;

      case 'rssForm.error':
        renderMessage(
          containers.feedbackMessage,
          i18nextInstance,
          watchedState,
        );
        break;

      case 'rssForm.processState':
        if (isFetchFinished(watchedState)) {
          renderMessage(
            containers.feedbackMessage,
            i18nextInstance,
            watchedState,
          );
        }

        processWatcher(containers, watchedState);
        break;

      default:
        throw new Error(`Unknown state: ${watchedState}`);
    }
  });

  return watchedState;
}
