import feedsMarkup from '../markup/feeds';

export default function renderFeeds(
  feedsContainer,
  i18nextInstance,
  watchedState,
) {
  const { feeds } = watchedState;
  if (feeds.length) {
    const content = feedsMarkup(feeds, i18nextInstance);
    feedsContainer.innerHTML = '';
    feedsContainer.insertAdjacentHTML('afterbegin', content);
  }
}
