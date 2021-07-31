import * as yup from 'yup';
import { message } from '../constants';
import fetchRSS from './fetchRSS';

const isValidUrl = (url, feeds) => {
  const isExistUrl = feeds.map((feed) => feed.url);
  const schema = yup
    .string()
    .required()
    .url(message.INVALID_RSS)
    .notOneOf(isExistUrl, message.IS_EXIST_FEED);

  return schema.validate(url);
};

const isLinkPressed = (event) => event.target.tagName === 'A';
const isButtonPreviewPressed = (event) => event.target.tagName === 'BUTTON';

export default function addUIHandlers(containers, watchedState) {
  const {
    formInput, rssForm, languageSelect, postsContainer,
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

    isValidUrl(url, watchedState.feeds)
      .then((rssUrl) => {
        formInput.classList.remove('is-invalid');
        fetchRSS(watchedState, rssUrl);
      })
      .catch((error) => {
        formInput.classList.add('is-invalid');
        watchedState.rssForm.error = error.message;
      });
  });

  postsContainer.addEventListener('click', (event) => {
    const post = event.target.closest('.list-group-item');
    const getTargetPost = () => {
      const postId = post.dataset.id;
      return watchedState.posts.find(({ id }) => id === postId);
    };

    if (isLinkPressed(event) || isButtonPreviewPressed(event)) {
      watchedState.ui.watchedPosts.add(getTargetPost().id);
    }

    if (isButtonPreviewPressed(event)) {
      watchedState.ui.selectedPost = getTargetPost();
    }
  });
}
