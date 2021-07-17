import * as yup from 'yup';
import { feedback } from '../constants';
import renderModal from '../renders/renderModal';
import fetchRSS from './fetchRSS';

const isValidUrl = (url) => {
  const schema = yup.string().required().url();
  return schema.isValid(url);
};

const isExistUrl = (data, url) => data.map((feed) => feed.url).includes(url);

const isLinkPressed = (event) => event.target.tagName === 'A';
const isButtonPreviewPressed = (event) => event.target.tagName === 'BUTTON';

export default function addUIHandlers(
  containers,
  i18nextInstance,
  watchedState,
) {
  const {
    formInput, rssForm, languageSelect, postsContainer, modalContainer,
  } = containers;

  languageSelect.addEventListener('click', (event) => {
    if (event.target.nodeName === 'INPUT') {
      const { language } = event.target.dataset;
      watchedState.ui.language = language;
    }
  });

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url').trim();

    isValidUrl(url).then((isValid) => {
      if (isValid) {
        if (isExistUrl(watchedState.feeds, url)) {
          watchedState.rssForm.error = true;
          watchedState.feedback = feedback.IS_EXIST_FEED;
          return;
        }

        formInput.classList.remove('is-invalid');
        fetchRSS(watchedState, url);
        return;
      }

      formInput.classList.add('is-invalid');
      watchedState.rssForm.error = true;
      watchedState.feedback = feedback.INVALID_RSS;
    });
  });

  postsContainer.addEventListener('click', (event) => {
    const post = event.target.closest('.list-group-item');
    const postTitle = post.dataset.title;

    if (isLinkPressed(event) || isButtonPreviewPressed(event)) {
      const selectedPost = watchedState.posts.find(
        ({ title }) => title === postTitle,
      );

      watchedState.ui.watchedPosts.add(selectedPost.title);
      renderModal(modalContainer, i18nextInstance, selectedPost);
    }
  });
}
