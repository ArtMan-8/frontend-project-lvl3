import 'bootstrap/dist/js/bootstrap.bundle';

function renderFeeds(feedsContainer, data, i18nextInstance) {
  feedsContainer.innerHTML = '';

  const content = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">${i18nextInstance.t('feeds')}</h2>
  </div>

  <ul class="list-group border-0 rounded-0">
    ${data
    .map(
      ({
        feed,
        url,
      }) => `<li class="list-group-item border-0 border-end-0" data-url="${url}" style="cursor: pointer">
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">
    ${feed.description}
    </p>
  </li>`,
    )
    .join('')}    
  </ul>
</div>`;

  feedsContainer.insertAdjacentHTML('afterbegin', content);
  return true;
}

function renderPosts(postsContainer, data, i18nextInstance) {
  postsContainer.innerHTML = '';

  const content = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">${i18nextInstance.t('posts')}</h2>
  </div>

  <ul class="list-group border-0 rounded-0">
  ${data.posts
    .map(
      (post) => `
  <li
    class="
      list-group-item
      d-flex
      justify-content-between
      align-items-start
      border-0 border-end-0
    "
  >
    <a
      href="${post.link}"
      class="fw-bold"
      target="_blank"
      rel="noopener noreferrer"
      >${post.title}</a
    ><button
      type="button"
      class="btn btn-outline-primary btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#modal"
      data-title="${post.title}"
    >
    ${i18nextInstance.t('buttons.view')}
    </button>
  </li>
  `,
    )
    .join('')}
</ul>
</div>`;

  postsContainer.insertAdjacentHTML('afterbegin', content);
  return true;
}

function renderModal(modalContainer, data, i18nextInstance) {
  const modalTitle = modalContainer.querySelector('.modal-title');
  const modalDescription = modalContainer.querySelector('.modal-body');
  const modalClose = modalContainer.querySelector('.btn-secondary');
  const modalContent = modalContainer.querySelector('.full-article');

  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modalClose.textContent = i18nextInstance.t('buttons.close');
  modalContent.textContent = i18nextInstance.t('buttons.readAll');
  modalContent.setAttribute('href', data.link);
}

export default function renderContent(
  containers,
  i18nextInstance,
  watchedState,
) {
  const { feedsContainer, postsContainer, modalContainer } = containers;
  const feeds = watchedState.dataFeeds;

  if (feeds.length > 0) {
    renderFeeds(feedsContainer, feeds, i18nextInstance);
    renderPosts(postsContainer, feeds[0], i18nextInstance);

    feedsContainer.addEventListener('click', (event) => {
      const feedPreview = event.target.closest('.list-group-item');

      if (feedPreview) {
        const selectedRss = feedPreview.dataset.url;
        const selectedFeed = feeds.find(({ url }) => url === selectedRss);
        renderPosts(postsContainer, selectedFeed, i18nextInstance);
      }
    });

    postsContainer.addEventListener('click', (event) => {
      const buttonPreview = event.target.closest('.btn-outline-primary');

      if (buttonPreview) {
        const selectedTitle = buttonPreview.dataset.title;
        const selectedPost = feeds
          .flatMap(({ posts }) => posts)
          .find(({ title }) => title === selectedTitle);

        renderModal(modalContainer, selectedPost, i18nextInstance);
      }
    });
  }
}
