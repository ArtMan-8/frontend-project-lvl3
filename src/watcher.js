import onChange from 'on-change';
import { formProcessState } from './constants';
import renderFeeds from './renders/renderFeeds';
import renderMessage from './renders/renderMessage';
import renderPosts from './renders/renderPosts';
import renderUI from './renders/renderUI';
import renderContent from './renders/renderContent';
import renderModal from './renders/renderModal';

export default function mainWatcher(state, i18nextInstance, containers) {
  const {
    postsContainer,
    feedsContainer,
    modalContainer,
    feedbackMessage,
    formInput,
    submitButton,
  } = containers;

  const watchedState = onChange(state, (key, value) => {
    switch (key) {
      case 'ui.language':
        i18nextInstance.changeLanguage(value).then(() => {
          renderUI(containers, i18nextInstance, watchedState);
          renderContent(containers, i18nextInstance, watchedState);
        });
        break;

      case 'ui.watchedPosts':
        renderPosts(postsContainer, i18nextInstance, watchedState);
        break;

      case 'ui.selectedPost':
        renderModal(modalContainer, i18nextInstance, watchedState);
        break;

      case 'feeds':
        renderFeeds(feedsContainer, i18nextInstance, watchedState);
        break;

      case 'posts':
        renderPosts(postsContainer, i18nextInstance, watchedState);
        formInput.value = '';
        break;

      case 'rssForm.isValid':
        if (value) {
          formInput.classList.remove('is-invalid');
        } else {
          formInput.classList.add('is-invalid');
        }
        break;

      case 'rssForm.error':
        break;

      case 'rssForm.processState':
        switch (watchedState.rssForm.processState) {
          case formProcessState.FAILED:
            renderMessage(feedbackMessage, i18nextInstance, watchedState);
            break;

          case formProcessState.FILLING:
            formInput.removeAttribute('readonly');
            submitButton.removeAttribute('disabled');
            break;

          case formProcessState.SENDING:
            formInput.setAttribute('readonly', 'true');
            submitButton.setAttribute('disabled', 'true');
            break;

          case formProcessState.FINISHED:
            renderMessage(feedbackMessage, i18nextInstance, watchedState);
            break;

          default:
            throw new Error(
              `Unknown formProcessState: ${watchedState.rssForm.processState}`,
            );
        }

        break;
      default:
        throw new Error(`Unknown state: ${watchedState}`);
    }
  });

  return watchedState;
}
