import postsMarkup from '../markup/posts';

export default function renderPosts(
  postsContainer,
  i18nextInstance,
  watchedState,
) {
  const { posts } = watchedState;

  if (posts.length) {
    const postsToRender = posts.map((post) => ({
      ...post,
      watched: watchedState.ui.watchedPosts.has(post.title),
    }));

    const content = postsMarkup(postsToRender, i18nextInstance);
    postsContainer.innerHTML = '';
    postsContainer.insertAdjacentHTML('afterbegin', content);
  }
}
