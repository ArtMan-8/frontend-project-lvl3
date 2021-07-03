import renderFeeds from './renderFeeds';
import renderPosts from './renderPosts';

export default function renderContent(
  containers,
  i18nextInstance,
  watchedState,
) {
  const { feedsContainer, postsContainer } = containers;
  renderFeeds(feedsContainer, i18nextInstance, watchedState);
  renderPosts(postsContainer, i18nextInstance, watchedState);
}
