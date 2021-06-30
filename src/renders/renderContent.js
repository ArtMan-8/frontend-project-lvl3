import 'bootstrap/dist/js/bootstrap.bundle';
import postsMarkup from '../markup/posts';
import feedsMarkup from '../markup/feeds';

function renderFeeds(feedsContainer, feeds, i18nextInstance) {
  const content = feedsMarkup(feeds, i18nextInstance);
  feedsContainer.innerHTML = '';
  feedsContainer.insertAdjacentHTML('afterbegin', content);
  return true;
}

function renderPosts(postsContainer, posts, i18nextInstance) {
  const content = postsMarkup(posts, i18nextInstance);
  postsContainer.innerHTML = '';
  postsContainer.insertAdjacentHTML('afterbegin', content);
  return true;
}

export function renderModal(modalContainer, selectedPost, i18nextInstance) {
  const modalTitle = modalContainer.querySelector('.modal-title');
  const modalDescription = modalContainer.querySelector('.modal-body');
  const modalClose = modalContainer.querySelector('.btn-secondary');
  const modalContent = modalContainer.querySelector('.full-article');

  const { title, description, link } = selectedPost;

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalClose.textContent = i18nextInstance.t('buttons.close');
  modalContent.textContent = i18nextInstance.t('buttons.readAll');
  modalContent.setAttribute('href', link);
}

export default function renderContent(
  containers,
  i18nextInstance,
  watchedState,
) {
  const { feedsContainer, postsContainer } = containers;
  const { dataFeeds, currentFeed } = watchedState;

  const selectedPosts = dataFeeds.find(({ url }) => url === currentFeed).posts;

  renderFeeds(feedsContainer, dataFeeds, i18nextInstance);
  renderPosts(postsContainer, selectedPosts, i18nextInstance);
}
