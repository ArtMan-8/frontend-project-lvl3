import * as yup from 'yup';
import { fetchRSS } from './handlers';
import { message } from '../constants';

const validate = (url, feeds) => {
  const existsUrls = feeds.map((feed) => feed.url);
  const schema = yup
    .string()
    .required()
    .url(message.INVALID_URL)
    .notOneOf(existsUrls, message.FEED_EXISTS);

  return schema.validate(url);
};

export default function addUIHandlers(containers, watchedState) {
  const { rssForm, languageSelect, postsContainer } = containers;

  languageSelect.addEventListener('click', (event) => {
    if (!event.target.dataset.language) {
      return;
    }

    const { language } = event.target.dataset;
    watchedState.ui.language = language;
  });

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url').trim();

    validate(url, watchedState.feeds)
      .then((rssUrl) => {
        fetchRSS(watchedState, rssUrl);
      })
      .catch((error) => {
        watchedState.rssForm.error = error.message;
      });
  });

  postsContainer.addEventListener('click', (event) => {
    if (!event.target.dataset.id) {
      return;
    }

    watchedState.ui.watchedPosts.add(event.target.dataset.id);
    watchedState.ui.selectedPost = event.target.dataset.id;
  });
}
