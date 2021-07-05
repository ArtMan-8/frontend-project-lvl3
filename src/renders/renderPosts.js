import postsMarkup from '../markup/posts';

export default function renderPosts(
  postsContainer,
  i18nextInstance,
  watchedState,
) {
  const { posts, currentFeed } = watchedState;

  if (posts.size) {
    const selectedPosts = posts.get(currentFeed);

    const postsToRender = selectedPosts.map((post) => ({
      ...post,
      watched: watchedState.watchedPosts.has(post.title),
    }));

    const content = postsMarkup(postsToRender, currentFeed, i18nextInstance);
    postsContainer.innerHTML = '';
    postsContainer.insertAdjacentHTML('afterbegin', content);
  }
}
