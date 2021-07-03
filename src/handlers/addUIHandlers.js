import * as yup from 'yup';
import { Feedback } from '../const';
import renderModal from '../renders/renderModal';
import fetchRSS from './fetchRSS';

const isValidUrl = (url) => {
  const schema = yup.string().required().url();
  return schema.isValid(url);
};

const isExistUrl = (data, url) => data.map((feed) => feed.url).includes(url);

export default function addUIHandlers(
  containers,
  i18nextInstance,
  watchedState,
) {
  const {
    formInput,
    rssForm,
    languageSelect,
    feedsContainer,
    postsContainer,
    modalContainer,
  } = containers;

  languageSelect.addEventListener('click', (event) => {
    if (event.target.nodeName === 'INPUT') {
      const { language } = event.target.dataset;
      watchedState.language = language;
    }
  });

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('rss').trim();

    isValidUrl(url).then((isvalid) => {
      if (!isvalid) {
        formInput.classList.add('is-invalid');
        watchedState.message = Feedback.INVALID_RSS;
        return;
      }

      formInput.classList.remove('is-invalid');

      if (isExistUrl(watchedState.feeds, url)) {
        watchedState.message = Feedback.IS_EXIST_FEED;
        return;
      }

      fetchRSS(watchedState, url);
    });
  });

  feedsContainer.addEventListener('click', (event) => {
    const feedPreview = event.target.closest('.list-group-item');

    if (feedPreview) {
      const selectedRss = feedPreview.dataset.url;
      watchedState.currentFeed = selectedRss;
    }
  });

  postsContainer.addEventListener('click', (event) => {
    const buttonPreview = event.target.closest('.btn-outline-primary');

    if (buttonPreview) {
      const selectedTitle = buttonPreview.dataset.title;
      const selectedFeed = buttonPreview.dataset.feed;
      const selectedPost = watchedState.posts
        .get(selectedFeed)
        .find(({ title }) => title === selectedTitle);

      watchedState.watchedPosts.add(selectedPost.title);
      renderModal(modalContainer, i18nextInstance, selectedPost);
    }
  });
}
