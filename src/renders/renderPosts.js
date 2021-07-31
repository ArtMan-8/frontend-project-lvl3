const createPostsContainer = () => {
  const container = document.createElement('div');
  container.setAttribute('class', 'card border-0');
  return container;
};

const createPostsHeader = (i18nextInstance) => {
  const header = document.createElement('div');
  header.setAttribute('class', 'card-body');
  header.innerHTML = `<h2 class="card-title h4">${i18nextInstance.t(
    'posts',
  )}</h2>`;
  return header;
};

const createPostsItem = (id, link, title, watched, i18nextInstance) => {
  const li = document.createElement('li');
  li.setAttribute(
    'class',
    'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
  );
  li.setAttribute('data-id', id);

  const a = document.createElement('a');
  a.setAttribute('class', `${watched ? 'fw-normal' : 'fw-bold'}`);
  a.setAttribute('href', link);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.textContent = title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'btn btn-outline-primary btn-sm');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = `${i18nextInstance.t('buttons.view')}`;

  li.append(a);
  li.append(button);

  return li;
};

const createPostsList = (feeds, i18nextInstance) => {
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group border-0 rounded-0');

  feeds.forEach(({
    id, link, title, watched,
  }) => {
    const feedItem = createPostsItem(id, link, title, watched, i18nextInstance);
    ul.append(feedItem);
  });

  return ul;
};

export default function renderPosts(
  postsContainer,
  i18nextInstance,
  watchedState,
) {
  const { posts } = watchedState;

  if (posts.length) {
    const postsToRender = posts.map((post) => ({
      ...post,
      watched: watchedState.ui.watchedPosts.has(post.id),
    }));

    postsContainer.innerHTML = '';
    const container = createPostsContainer();
    const header = createPostsHeader(i18nextInstance);
    const feedList = createPostsList(postsToRender, i18nextInstance);

    container.append(header);
    container.append(feedList);
    postsContainer.append(container);
  }
}
